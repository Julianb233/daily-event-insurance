"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import {
  Camera,
  MousePointer2,
  Highlighter,
  Type,
  ArrowRight,
  Square,
  Circle,
  Undo2,
  Redo2,
  Check,
  X,
  Download,
  Trash2,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface ScreenCaptureResult {
  id: string
  dataUrl: string
  blob: Blob
  width: number
  height: number
  timestamp: number
  annotations?: AnnotationData[]
}

export interface AnnotationData {
  id: string
  type: AnnotationTool
  points: { x: number; y: number }[]
  color: string
  strokeWidth: number
  text?: string
}

export type AnnotationTool = "pointer" | "highlight" | "arrow" | "rectangle" | "circle" | "text"

export interface ScreenCaptureProps {
  onCapture: (result: ScreenCaptureResult) => void
  onCancel?: () => void
  className?: string
}

const ANNOTATION_COLORS = [
  "#EF4444", // red
  "#F59E0B", // amber
  "#10B981", // emerald
  "#3B82F6", // blue
  "#8B5CF6", // violet
  "#EC4899", // pink
]

export function ScreenCaptureButton({
  onCapture,
  disabled = false,
  className,
}: {
  onCapture: (result: ScreenCaptureResult) => void
  disabled?: boolean
  className?: string
}) {
  const [isCapturing, setIsCapturing] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [capturedImage, setCapturedImage] = useState<{
    dataUrl: string
    blob: Blob
    width: number
    height: number
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const captureScreen = useCallback(async () => {
    setIsCapturing(true)
    setError(null)

    try {
      // Use html2canvas approach for reliable cross-browser capture
      const { default: html2canvas } = await import("html2canvas").catch(() => {
        // Fallback if html2canvas is not available
        return { default: null }
      })

      if (html2canvas) {
        const canvas = await html2canvas(document.body, {
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          scale: window.devicePixelRatio || 1,
          logging: false,
        })

        const dataUrl = canvas.toDataURL("image/png")
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), "image/png")
        })

        setCapturedImage({
          dataUrl,
          blob,
          width: canvas.width,
          height: canvas.height,
        })
        setShowEditor(true)
      } else {
        // Alternative: use getDisplayMedia for screen capture
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { displaySurface: "browser" } as MediaTrackConstraints,
        })

        const video = document.createElement("video")
        video.srcObject = stream

        await new Promise<void>((resolve) => {
          video.onloadedmetadata = () => {
            video.play()
            resolve()
          }
        })

        const canvas = document.createElement("canvas")
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext("2d")!
        ctx.drawImage(video, 0, 0)

        // Stop the stream
        stream.getTracks().forEach((track) => track.stop())

        const dataUrl = canvas.toDataURL("image/png")
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), "image/png")
        })

        setCapturedImage({
          dataUrl,
          blob,
          width: canvas.width,
          height: canvas.height,
        })
        setShowEditor(true)
      }
    } catch (err) {
      console.error("Screen capture failed:", err)
      setError("Could not capture screen. Please try again or upload a screenshot instead.")
    } finally {
      setIsCapturing(false)
    }
  }, [])

  const handleEditorComplete = useCallback(
    (result: ScreenCaptureResult) => {
      setShowEditor(false)
      setCapturedImage(null)
      onCapture(result)
    },
    [onCapture]
  )

  const handleEditorCancel = useCallback(() => {
    setShowEditor(false)
    setCapturedImage(null)
  }, [])

  return (
    <>
      <button
        onClick={captureScreen}
        disabled={disabled || isCapturing}
        className={cn(
          "flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
          "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700",
          "text-zinc-700 dark:text-zinc-300",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        title="Capture screenshot"
      >
        {isCapturing ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Camera className="w-4 h-4" />
        )}
        <span>Screenshot</span>
      </button>

      {error && (
        <div className="text-xs text-red-500 mt-1">{error}</div>
      )}

      {showEditor && capturedImage && (
        <ScreenCaptureEditor
          image={capturedImage}
          onComplete={handleEditorComplete}
          onCancel={handleEditorCancel}
        />
      )}
    </>
  )
}

interface ScreenCaptureEditorProps {
  image: {
    dataUrl: string
    blob: Blob
    width: number
    height: number
  }
  onComplete: (result: ScreenCaptureResult) => void
  onCancel: () => void
}

function ScreenCaptureEditor({
  image,
  onComplete,
  onCancel,
}: ScreenCaptureEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [tool, setTool] = useState<AnnotationTool>("pointer")
  const [color, setColor] = useState(ANNOTATION_COLORS[0])
  const [annotations, setAnnotations] = useState<AnnotationData[]>([])
  const [undoStack, setUndoStack] = useState<AnnotationData[][]>([])
  const [redoStack, setRedoStack] = useState<AnnotationData[][]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentAnnotation, setCurrentAnnotation] = useState<AnnotationData | null>(null)
  const [scale, setScale] = useState(1)

  // Initialize canvas with image
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const img = new Image()
    img.onload = () => {
      // Calculate scale to fit in container
      const maxWidth = container.clientWidth - 48
      const maxHeight = window.innerHeight * 0.6
      const scaleX = maxWidth / img.width
      const scaleY = maxHeight / img.height
      const newScale = Math.min(scaleX, scaleY, 1)
      setScale(newScale)

      canvas.width = img.width * newScale
      canvas.height = img.height * newScale

      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }
    img.src = image.dataUrl
  }, [image.dataUrl])

  // Redraw canvas with annotations
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")!
    const img = new Image()
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Draw all annotations
      annotations.forEach((annotation) => {
        drawAnnotation(ctx, annotation)
      })

      // Draw current annotation if drawing
      if (currentAnnotation) {
        drawAnnotation(ctx, currentAnnotation)
      }
    }
    img.src = image.dataUrl
  }, [annotations, currentAnnotation, image.dataUrl])

  useEffect(() => {
    redrawCanvas()
  }, [redrawCanvas])

  const drawAnnotation = (ctx: CanvasRenderingContext2D, annotation: AnnotationData) => {
    ctx.strokeStyle = annotation.color
    ctx.fillStyle = annotation.color
    ctx.lineWidth = annotation.strokeWidth
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    const { points, type } = annotation

    switch (type) {
      case "highlight":
        if (points.length >= 2) {
          ctx.globalAlpha = 0.3
          ctx.beginPath()
          ctx.moveTo(points[0].x, points[0].y)
          points.forEach((p) => ctx.lineTo(p.x, p.y))
          ctx.stroke()
          ctx.globalAlpha = 1
        }
        break

      case "arrow":
        if (points.length >= 2) {
          const start = points[0]
          const end = points[points.length - 1]
          const angle = Math.atan2(end.y - start.y, end.x - start.x)
          const headLength = 15

          ctx.beginPath()
          ctx.moveTo(start.x, start.y)
          ctx.lineTo(end.x, end.y)
          ctx.stroke()

          // Arrow head
          ctx.beginPath()
          ctx.moveTo(end.x, end.y)
          ctx.lineTo(
            end.x - headLength * Math.cos(angle - Math.PI / 6),
            end.y - headLength * Math.sin(angle - Math.PI / 6)
          )
          ctx.moveTo(end.x, end.y)
          ctx.lineTo(
            end.x - headLength * Math.cos(angle + Math.PI / 6),
            end.y - headLength * Math.sin(angle + Math.PI / 6)
          )
          ctx.stroke()
        }
        break

      case "rectangle":
        if (points.length >= 2) {
          const start = points[0]
          const end = points[points.length - 1]
          ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y)
        }
        break

      case "circle":
        if (points.length >= 2) {
          const start = points[0]
          const end = points[points.length - 1]
          const radiusX = Math.abs(end.x - start.x) / 2
          const radiusY = Math.abs(end.y - start.y) / 2
          const centerX = start.x + (end.x - start.x) / 2
          const centerY = start.y + (end.y - start.y) / 2

          ctx.beginPath()
          ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI)
          ctx.stroke()
        }
        break

      case "text":
        if (points.length > 0 && annotation.text) {
          ctx.font = "16px sans-serif"
          ctx.fillText(annotation.text, points[0].x, points[0].y)
        }
        break

      default:
        break
    }
  }

  const getCanvasCoords = (e: React.MouseEvent): { x: number; y: number } => {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (tool === "pointer") return

    const coords = getCanvasCoords(e)
    setIsDrawing(true)
    setCurrentAnnotation({
      id: `annotation-${Date.now()}`,
      type: tool,
      points: [coords],
      color,
      strokeWidth: tool === "highlight" ? 20 : 2,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !currentAnnotation) return

    const coords = getCanvasCoords(e)
    setCurrentAnnotation((prev) => {
      if (!prev) return null
      return {
        ...prev,
        points: [...prev.points, coords],
      }
    })
  }

  const handleMouseUp = () => {
    if (!isDrawing || !currentAnnotation) return

    setIsDrawing(false)
    setUndoStack((prev) => [...prev, annotations])
    setRedoStack([])
    setAnnotations((prev) => [...prev, currentAnnotation])
    setCurrentAnnotation(null)
  }

  const handleUndo = () => {
    if (undoStack.length === 0) return
    const previous = undoStack[undoStack.length - 1]
    setRedoStack((prev) => [...prev, annotations])
    setAnnotations(previous)
    setUndoStack((prev) => prev.slice(0, -1))
  }

  const handleRedo = () => {
    if (redoStack.length === 0) return
    const next = redoStack[redoStack.length - 1]
    setUndoStack((prev) => [...prev, annotations])
    setAnnotations(next)
    setRedoStack((prev) => prev.slice(0, -1))
  }

  const handleClear = () => {
    setUndoStack((prev) => [...prev, annotations])
    setRedoStack([])
    setAnnotations([])
  }

  const handleComplete = async () => {
    const canvas = canvasRef.current!
    const dataUrl = canvas.toDataURL("image/png")
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), "image/png")
    })

    onComplete({
      id: `capture-${Date.now()}`,
      dataUrl,
      blob,
      width: canvas.width / scale,
      height: canvas.height / scale,
      timestamp: Date.now(),
      annotations,
    })
  }

  const tools: { id: AnnotationTool; icon: React.ReactNode; label: string }[] = [
    { id: "pointer", icon: <MousePointer2 className="w-4 h-4" />, label: "Select" },
    { id: "highlight", icon: <Highlighter className="w-4 h-4" />, label: "Highlight" },
    { id: "arrow", icon: <ArrowRight className="w-4 h-4" />, label: "Arrow" },
    { id: "rectangle", icon: <Square className="w-4 h-4" />, label: "Rectangle" },
    { id: "circle", icon: <Circle className="w-4 h-4" />, label: "Circle" },
    { id: "text", icon: <Type className="w-4 h-4" />, label: "Text" },
  ]

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col">
      {/* Header toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <h3 className="text-white font-medium">Annotate Screenshot</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={undoStack.length === 0}
            className="p-2 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            title="Undo"
          >
            <Undo2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            className="p-2 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            title="Redo"
          >
            <Redo2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleClear}
            disabled={annotations.length === 0}
            className="p-2 text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            title="Clear all"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          <div className="w-px h-6 bg-zinc-700 mx-2" />

          <button
            onClick={onCancel}
            className="px-4 py-2 text-zinc-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleComplete}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg"
          >
            <Check className="w-4 h-4" />
            Attach
          </button>
        </div>
      </div>

      {/* Tool palette */}
      <div className="flex items-center justify-center gap-4 px-4 py-3 bg-zinc-800 border-b border-zinc-700">
        {/* Tools */}
        <div className="flex items-center gap-1 bg-zinc-900 rounded-lg p-1">
          {tools.map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              className={cn(
                "p-2 rounded-md transition-colors",
                tool === t.id
                  ? "bg-teal-600 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-700"
              )}
              title={t.label}
            >
              {t.icon}
            </button>
          ))}
        </div>

        {/* Color picker */}
        <div className="flex items-center gap-1 bg-zinc-900 rounded-lg p-1">
          {ANNOTATION_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={cn(
                "w-6 h-6 rounded-md transition-transform",
                color === c && "ring-2 ring-white ring-offset-1 ring-offset-zinc-900 scale-110"
              )}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>
      </div>

      {/* Canvas area */}
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center p-6 overflow-auto"
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={cn(
            "rounded-lg shadow-2xl cursor-crosshair",
            tool === "pointer" && "cursor-default"
          )}
        />
      </div>
    </div>
  )
}

// Simple screenshot preview component
export function ScreenshotPreview({
  src,
  onRemove,
  onClick,
  className,
}: {
  src: string
  onRemove?: () => void
  onClick?: () => void
  className?: string
}) {
  return (
    <div
      className={cn(
        "relative group rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700",
        className
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Screenshot"
        className="w-full h-full object-cover cursor-pointer"
        onClick={onClick}
      />
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Remove screenshot"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}
