import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { partners, partnerDocuments } from "@/lib/db/schema"
import { eq, and, inArray } from "drizzle-orm"
import { requirePartner, withAuth } from "@/lib/api-auth"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { DOCUMENT_TYPES, getDocumentByType } from "@/lib/demo-documents"

// POST /api/documents/pdf - Generate PDF of signed documents
// SECURITY: Requires partner authentication and ownership verification
export async function POST(request: Request) {
  return withAuth(async () => {
    const { userId } = await requirePartner()

    try {
      const body = await request.json()
      const { partnerId, documentTypes } = body

      if (!partnerId || !documentTypes || !Array.isArray(documentTypes)) {
        return NextResponse.json(
          { success: false, error: "Missing required fields" },
          { status: 400 }
        )
      }

      if (!db) {
        return NextResponse.json(
          { success: false, error: "Database not configured" },
          { status: 500 }
        )
      }

      // Get the partner and verify ownership
      const [partner] = await db
        .select()
        .from(partners)
        .where(eq(partners.id, partnerId))
        .limit(1)

      if (!partner) {
        return NextResponse.json(
          { success: false, error: "Partner not found" },
          { status: 404 }
        )
      }

      // SECURITY: Verify ownership
      if (partner.userId !== userId) {
        return NextResponse.json(
          { success: false, error: "Forbidden" },
          { status: 403 }
        )
      }

      // Get signed documents
      const signedDocs = await db
        .select()
        .from(partnerDocuments)
        .where(
          and(
            eq(partnerDocuments.partnerId, partnerId),
            eq(partnerDocuments.status, "signed"),
            inArray(partnerDocuments.documentType, documentTypes)
          )
        )

      if (signedDocs.length === 0) {
        return NextResponse.json(
          { success: false, error: "No signed documents found" },
          { status: 404 }
        )
      }

      // Create PDF document
      const pdfDoc = await PDFDocument.create()
      const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
      const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)

      for (const doc of signedDocs) {
        const template = getDocumentByType(doc.documentType as any)
        if (!template) continue

        // Add a page for each document
        const page = pdfDoc.addPage([612, 792]) // Letter size
        const { height } = page.getSize()
        const margin = 50
        const lineHeight = 14
        let yPosition = height - margin

        // Title
        page.drawText(template.title, {
          x: margin,
          y: yPosition,
          size: 18,
          font: timesRomanBoldFont,
          color: rgb(0, 0, 0),
        })
        yPosition -= 30

        // Document info
        page.drawText(`Version: ${template.version}`, {
          x: margin,
          y: yPosition,
          size: 10,
          font: timesRomanFont,
          color: rgb(0.4, 0.4, 0.4),
        })
        yPosition -= 15

        page.drawText(`Signed: ${doc.signedAt?.toLocaleString() || "Unknown"}`, {
          x: margin,
          y: yPosition,
          size: 10,
          font: timesRomanFont,
          color: rgb(0.4, 0.4, 0.4),
        })
        yPosition -= 30

        // Content - parse markdown-like content to simple text
        const content = doc.contentSnapshot || template.content
        const lines = content.split("\n")

        for (const line of lines) {
          if (yPosition < margin + 50) {
            // Add new page if we're running out of space
            const newPage = pdfDoc.addPage([612, 792])
            yPosition = height - margin
          }

          // Clean markdown formatting
          let cleanLine = line
            .replace(/^#+\s*/, "") // Remove headers
            .replace(/\*\*/g, "") // Remove bold
            .replace(/\*/g, "") // Remove italic
            .replace(/^-\s*/, "  - ") // Format list items

          if (cleanLine.trim() === "") {
            yPosition -= lineHeight / 2
            continue
          }

          // Check if it's a header (was starting with #)
          const isHeader = line.match(/^#+\s*/)
          const fontSize = isHeader ? 14 : 11
          const font = isHeader ? timesRomanBoldFont : timesRomanFont

          // Word wrap long lines
          const maxWidth = 512
          const words = cleanLine.split(" ")
          let currentLine = ""

          for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word
            const testWidth = font.widthOfTextAtSize(testLine, fontSize)

            if (testWidth > maxWidth && currentLine) {
              page.drawText(currentLine, {
                x: margin,
                y: yPosition,
                size: fontSize,
                font,
                color: rgb(0, 0, 0),
              })
              yPosition -= lineHeight
              currentLine = word

              if (yPosition < margin + 50) {
                const newPage = pdfDoc.addPage([612, 792])
                yPosition = height - margin
              }
            } else {
              currentLine = testLine
            }
          }

          if (currentLine) {
            page.drawText(currentLine, {
              x: margin,
              y: yPosition,
              size: fontSize,
              font,
              color: rgb(0, 0, 0),
            })
            yPosition -= lineHeight
          }

          if (isHeader) {
            yPosition -= 5
          }
        }

        // Add signature image if it exists
        if (doc.signatureImage && doc.signatureType === "drawn") {
          try {
            // Decode base64 signature image
            const base64Data = doc.signatureImage.replace(/^data:image\/png;base64,/, "")
            const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0))
            const signatureImage = await pdfDoc.embedPng(imageBytes)

            // Add signature to page
            yPosition -= 30
            if (yPosition < margin + 100) {
              const newPage = pdfDoc.addPage([612, 792])
              yPosition = height - margin - 50
            }

            page.drawText("Signature:", {
              x: margin,
              y: yPosition,
              size: 12,
              font: timesRomanBoldFont,
              color: rgb(0, 0, 0),
            })
            yPosition -= 20

            const sigDims = signatureImage.scale(0.5)
            page.drawImage(signatureImage, {
              x: margin,
              y: yPosition - Math.min(sigDims.height, 60),
              width: Math.min(sigDims.width, 200),
              height: Math.min(sigDims.height, 60),
            })
          } catch (err) {
            console.error("Error embedding signature image:", err)
          }
        }

        // Footer
        page.drawText(
          `Generated by Daily Event Insurance Partner Portal - ${new Date().toLocaleDateString()}`,
          {
            x: margin,
            y: margin - 20,
            size: 8,
            font: timesRomanFont,
            color: rgb(0.6, 0.6, 0.6),
          }
        )
      }

      // Generate PDF bytes
      const pdfBytes = await pdfDoc.save()

      // Return as blob (convert Uint8Array to Buffer for NextResponse)
      return new NextResponse(Buffer.from(pdfBytes), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="signed-documents-${new Date().toISOString().split("T")[0]}.pdf"`,
        },
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      return NextResponse.json(
        { success: false, error: "Failed to generate PDF" },
        { status: 500 }
      )
    }
  })
}
