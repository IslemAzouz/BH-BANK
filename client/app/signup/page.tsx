"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useTranslation } from "@/hooks/use-translation"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import { motion } from "framer-motion"
import { Eye, EyeOff } from "lucide-react"

export default function SignupPage() {
  const { t } = useTranslation()
  const { toast } = useToast()
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    RIB: "",
    CIN: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.password || !formData.RIB || !formData.CIN) {
      toast({
        title: t("signup.error"),
        description: t("signup.fillAllFields"),
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", formData)

      // Store token and user info in localStorage
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))

      toast({
        title: t("signup.success"),
        description: t("signup.accountCreated"),
      })

      // Redirect to home page
      router.push("/")
    } catch (error: any) {
      console.error("Signup error:", error)

      const errorMessage = error.response?.data?.error || t("signup.errorOccurred")

      toast({
        title: t("signup.error"),
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

        <h1 className="text-2xl font-bold text-center mb-6">{t("signup.title")}</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-2 font-medium">
              {t("signup.email")}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-md bg-background"
              placeholder={t("signup.emailPlaceholder")}
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 font-medium">
              {t("signup.password")}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-md bg-background pr-10"
                placeholder={t("signup.passwordPlaceholder")}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="CIN" className="block mb-2 font-medium">
              {t("signup.cin")}
            </label>
            <input
              type="text"
              id="CIN"
              name="CIN"
              value={formData.CIN}
              onChange={handleChange}
              className="w-full p-3 border rounded-md bg-background"
              placeholder={t("signup.cinPlaceholder")}
            />
          </div>

          <div>
            <label htmlFor="RIB" className="block mb-2 font-medium">
              {t("signup.rib")}
            </label>
            <input
              type="text"
              id="RIB"
              name="RIB"
              value={formData.RIB}
              onChange={handleChange}
              className="w-full p-3 border rounded-md bg-background"
              placeholder={t("signup.ribPlaceholder")}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70"
          >
            {isLoading ? t("signup.creating") : t("signup.createAccount")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p>
            {t("signup.alreadyHaveAccount")}{" "}
            <Link href="/login" className="text-primary hover:underline">
              {t("signup.login")}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
