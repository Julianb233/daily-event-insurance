"use client"

import { useRef, useEffect, useState } from "react"
import SignatureCanvas from "react-signature-canvas"
import { Eraser, Pencil } from "lucide-react"

interface SignaturePadProps {
  onSignatureChange: (signatureDataUrl: string | null) => void
  disabled?: boolean
  className?: string
}

export function SignaturePad({
  onSignatureChange,
  disabled = false,
  className = "",
}: SignaturePadProps) {
  const sigCanvas = useRef<SignatureCanvas>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isEmpty, setIsEmpty] = useState(true)
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 150 })

  // Resize canvas to fit container
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setCanvasSize({
          width: Math.min(rect.width - 2, 600), // -2 for border
          height: 150,
        })
      }
    }

    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  const handleEnd = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      // Get trimmed canvas data (removes whitespace)
      const dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png")
      onSignatureChange(dataUrl)
      setIsEmpty(false)
    }
  }

  const handleClear = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear()
      onSignatureChange(null)
      setIsEmpty(true)
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Pencil className="w-4 h-4" />
          <span>Draw your signature below</span>
        </div>
        <button
          type="button"
          onClick={handleClear}
          disabled={disabled || isEmpty}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Eraser className="w-4 h-4" />
          Clear
        </button>
      </div>

      <div
        ref={containerRef}
        className={`relative border-2 border-dashed rounded-lg bg-white ${
          disabled ? "opacity-50 cursor-not-allowed" : "border-gray-300 hover:border-teal-400"
        } ${isEmpty ? "" : "border-teal-500"}`}
      >
        <SignatureCanvas
          ref={sigCanvas}
          canvasProps={{
            width: canvasSize.width,
            height: canvasSize.height,
            className: "rounded-lg touch-none",
            style: {
              width: "100%",
              height: `${canvasSize.height}px`,
            },
          }}
          penColor="#1f2937"
          minWidth={1.5}
          maxWidth={3}
          onEnd={handleEnd}
        />

        {/* Signature line */}
        <div className="absolute bottom-8 left-8 right-8 border-b border-gray-300" />
        <span className="absolute bottom-2 left-8 text-xs text-gray-400">
          Sign here
        </span>

        {/* Disabled overlay */}
        {disabled && (
          <div className="absolute inset-0 bg-gray-100/50 rounded-lg cursor-not-allowed" />
        )}
      </div>

      <p className="text-xs text-gray-500">
        Use your mouse, finger, or stylus to sign. Your signature will be embedded in the document.
      </p>
    </div>
  )
}
