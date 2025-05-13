"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface AdminProtectedRouteProps {
  children: ReactNode
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAdminStatus = () => {
      const token = localStorage.getItem("token")
      const userData = localStorage.getItem("user")

      if (!token || !userData) {
        toast({
          title: "Accès refusé",
          description: "Vous devez être connecté pour accéder à cette page",
          variant: "destructive",
        })
        router.push("/login")
        return
      }

      try {
        const user = JSON.parse(userData)

        if (user.admin !== 1) {
          toast({
            title: "Accès refusé",
            description: "Vous n'avez pas les droits d'accès à cette page",
            variant: "destructive",
          })
          router.push("/dashboard")
          return
        }

        setIsAdmin(true)
      } catch (error) {
        console.error("Erreur lors de la vérification des droits d'administrateur:", error)
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification de vos droits",
          variant: "destructive",
        })
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminStatus()
  }, [router, toast])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return <>{children}</>
}
