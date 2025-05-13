"use client"

import type React from "react"

import { useState } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useTranslation } from "@/hooks/use-translation"
import { motion } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import axios from "axios"
import { MapPin, Phone, Mail } from "lucide-react"

export default function ContactPage() {
  const { t } = useTranslation()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: t("contact.error"),
        description: t("contact.fillAllFields"),
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await axios.post("http://localhost:5000/api/rec/post", formData)

      toast({
        title: t("contact.success"),
        description: t("contact.messageSent"),
      })

      setFormData({
        name: "",
        email: "",
        message: "",
      })
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: t("contact.error"),
        description: t("contact.errorOccurred"),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-12">
        <motion.h1
          className="text-4xl font-bold mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t("contact.title")}
        </motion.h1>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold mb-6">{t("contact.getInTouch")}</h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-medium">{t("contact.address")}</h3>
                  <p className="text-muted-foreground">18 Avenue Mohamed V, Tunis 1023, Tunisie</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-medium">{t("contact.phone")}</h3>
                  <p className="text-muted-foreground">+216 71 126 000</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="w-6 h-6 text-primary mt-1" />
                <div>
                  <h3 className="font-medium">{t("contact.email")}</h3>
                  <p className="text-muted-foreground">contact@bhbank.tn</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2 font-medium">
                  {t("contact.name")}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md bg-background"
                  placeholder={t("contact.namePlaceholder")}
                />
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 font-medium">
                  {t("contact.email")}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-md bg-background"
                  placeholder={t("contact.emailPlaceholder")}
                />
              </div>

              <div>
                <label htmlFor="message" className="block mb-2 font-medium">
                  {t("contact.message")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full p-3 border rounded-md bg-background"
                  placeholder={t("contact.messagePlaceholder")}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-primary text-white font-medium rounded-md hover:bg-primary/90 transition-colors disabled:opacity-70"
              >
                {isSubmitting ? t("contact.sending") : t("contact.send")}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
