"use client"

import { useState, useCallback } from "react"

type ToastVariant = "default" | "destructive" | "success"

interface ToastProps {
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([])

  const toast = useCallback(({ title, description, variant = "default", duration = 5000 }: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9)

    setToasts((prev) => [...prev, { id, title, description, variant, duration }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, duration)

    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return { toast, dismiss, toasts }
}
