"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useTranslation } from "@/hooks/use-translation"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import { motion } from "framer-motion"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const router = useRouter()

  const [formData, setFormData] = useState({
    CIN: "",
    RIB: "",
  })

  const [showRIB, setShowRIB] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      // Vérifier si l'utilisateur est un administrateur
      const userData = localStorage.getItem("user")
      if (userData) {
        try {
          const user = JSON.parse(userData)
          if (user.admin === 1) {
            router.push("/admin/dashboard")
          } else {
            router.push("/dashboard")
          }
        } catch (error) {
          console.error("Erreur lors de l'analyse des données utilisateur:", error)
          localStorage.removeItem("token")
          localStorage.removeItem("user")
        }
      } else {
        router.push("/dashboard")
      }
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.CIN || !formData.RIB) {
      toast({
        title: t("login.error"),
        description: t("login.fillAllFields"),
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData)

      // Store token and user info in localStorage
      localStorage.setItem("token", response.data.token)

      // S'assurer que l'objet utilisateur contient le CIN
      const userData = response.data.user || {}
      // Si le CIN est manquant mais que nous l'avons dans le formulaire, l'ajouter
      if (!userData.CIN && formData.CIN) {
        userData.CIN = formData.CIN
      }
      localStorage.setItem("user", JSON.stringify(userData))

      toast({
        title: t("login.success"),
        description: t("login.welcomeBack"),
      })

      // Rediriger vers le tableau de bord approprié en fonction du rôle
      if (userData.admin === 1) {
        router.push("/admin/dashboard")
      } else {
        router.push("/dashboard")
      }
    } catch (error: any) {
      console.error("Login error:", error)

      const errorMessage = error.response?.data?.error || t("login.errorOccurred")

      toast({
        title: t("login.error"),
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/50">
      <motion.div
        className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-6">
          <Image src="/images/logo.png" alt="BH BANK Logo" width={180} height={60} priority />
        </div>

        <h1 className="text-2xl font-bold text-center mb-6">{t("login.title")}</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="CIN" className="block mb-2 font-medium">
              {t("login.cin")}
            </label>
            <input
              type="text"
              id="CIN"
              name="CIN"
              value={formData.CIN}
              onChange={handleChange}
              className="w-full p-3 border rounded-md bg-background"
              placeholder={t("login.cinPlaceholder")}
            />
          </div>

          <div>
            <label htmlFor="RIB" className="block mb-2 font-medium">
              {t("login.rib")}
            </label>
            <div className="relative">
              <input
                type={showRIB ? "text" : "password"}
                id="RIB"
                name="RIB"
                value={formData.RIB}
                onChange={handleChange}
                className="w-full p-3 border rounded-md bg-background pr-10"
                placeholder={t("login.ribPlaceholder")}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowRIB(!showRIB)}
              >
                {showRIB ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70"
          >
            {isLoading ? t("login.loggingIn") : t("login.login")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p>
            {t("login.noAccount")}{" "}
            <Link href="/signup" className="text-primary hover:underline">
              {t("login.signUp")}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
