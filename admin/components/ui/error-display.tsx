import React from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, XCircle, Info } from "lucide-react"

export type ErrorType = "error" | "warning" | "info"

interface ErrorDisplayProps {
  message: string
  type?: ErrorType
  className?: string
  onDismiss?: () => void
}

export function ErrorDisplay({ 
  message, 
  type = "error", 
  className = "",
  onDismiss 
}: ErrorDisplayProps) {
  if (!message) return null

  const getAlertStyles = () => {
    switch (type) {
      case "error":
        return "bg-red-50 text-red-800 border-red-200"
      case "warning":
        return "bg-yellow-50 text-yellow-800 border-yellow-200"
      case "info":
        return "bg-blue-50 text-blue-800 border-blue-200"
      default:
        return "bg-red-50 text-red-800 border-red-200"
    }
  }

  const getIcon = () => {
    switch (type) {
      case "error":
        return <XCircle className="h-4 w-4" />
      case "warning":
        return <AlertCircle className="h-4 w-4" />
      case "info":
        return <Info className="h-4 w-4" />
      default:
        return <XCircle className="h-4 w-4" />
    }
  }

  return (
    <Alert className={`${getAlertStyles()} ${className}`}>
      <div className="flex items-center gap-2">
        {getIcon()}
        <AlertDescription>{message}</AlertDescription>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-auto hover:opacity-70 transition-opacity"
            aria-label="Dismiss error"
          >
            <XCircle className="h-4 w-4" />
          </button>
        )}
      </div>
    </Alert>
  )
} 