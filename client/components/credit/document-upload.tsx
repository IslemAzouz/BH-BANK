"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Upload, FileText, Check, AlertCircle, Loader2 } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import { Progress } from "@/components/ui/progress"
import axios from "axios"
import { toast } from "sonner"

interface DocumentUploadProps {
  onSubmit: (documents: {
    cinRecto: string | null
    cinVerso: string | null
    bankStatements: string | null
    taxDeclaration: string | null
    incomeProof: string | null
    businessRegistry: string | null
    residenceProof: string | null
  }) => void
  onBack: () => void
}

export default function DocumentUpload({ onSubmit, onBack }: DocumentUploadProps) {
  const { t } = useTranslation()

  const [files, setFiles] = useState<Record<string, File | null>>({
    cinRecto: null,
    cinVerso: null,
    bankStatements: null,
    taxDeclaration: null,
    incomeProof: null,
    businessRegistry: null,
    residenceProof: null,
  })

  const [uploadedUrls, setUploadedUrls] = useState<typeof files>({
    cinRecto: null,
    cinVerso: null,
    bankStatements: null,
    taxDeclaration: null,
    incomeProof: null,
    businessRegistry: null,
    residenceProof: null,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploading, setUploading] = useState<Record<string, boolean>>({})
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const verifyIdentityCard = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await axios.post("http://localhost:8000/analyze", formData)
      return res.data.result.trim().toLowerCase()
    } catch (error) {
      console.error("Verification error:", error)
      return "error"
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const selectedFile = e.target.files?.[0] || null

    setFiles((prev) => ({ ...prev, [fieldName]: selectedFile }))

    if (errors[fieldName]) {
      setErrors((prev) => {
        const updated = { ...prev }
        delete updated[fieldName]
        return updated
      })
    }

    if (selectedFile) {
      // Pre-validation
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("Fichier trop volumineux (max 5MB)")
        return
      }

      const validTypes = ["image/jpeg", "image/png", "application/pdf"]
      if (!validTypes.includes(selectedFile.type)) {
        toast.error("Format non supporté (JPEG, PNG ou PDF uniquement)")
        return
      }

      // CIN check with AI
      if (fieldName === "cinRecto" || fieldName === "cinVerso") {
        const result = await verifyIdentityCard(selectedFile)
        if (result === "yes") {
          toast.success(`✅ ${fieldName} vérifié : Carte d'identité détectée`)
        } else if (result === "no") {
          toast.warning(`⚠️ ${fieldName} ne semble pas être une carte d'identité valide`)
        } else {
          toast.error("Erreur lors de la vérification avec l'IA.")
        }
      }

      uploadToCloudinary(selectedFile, fieldName)
    } else {
      setUploadedUrls((prev) => ({ ...prev, [fieldName]: null }))
    }
  }

  const uploadToCloudinary = async (file: File, fieldName: string) => {
    setUploading((prev) => ({ ...prev, [fieldName]: true }))
    setUploadProgress((prev) => ({ ...prev, [fieldName]: 0 }))

    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", "bh_bank_docs")

      const res = await axios.post("https://api.cloudinary.com/v1_1/dp6jqmcwp/upload", formData, {
        onUploadProgress: (event) => {
          if (event.total) {
            const progress = Math.round((event.loaded * 100) / event.total)
            setUploadProgress((prev) => ({ ...prev, [fieldName]: progress }))
          }
        },
      })

      setUploadedUrls((prev) => ({ ...prev, [fieldName]: res.data.secure_url }))
    } catch (err) {
      console.error("Cloudinary upload error:", err)
      setErrors((prev) => ({ ...prev, [fieldName]: "Erreur lors du téléversement. Veuillez réessayer." }))
    } finally {
      setUploading((prev) => {
        const updated = { ...prev }
        delete updated[fieldName]
        return updated
      })
    }
  }

  const validateForm = () => {
    const requiredFields = ["cinRecto", "cinVerso", "bankStatements", "incomeProof", "residenceProof"]
    const newErrors: Record<string, string> = {}

    requiredFields.forEach((field) => {
      if (!uploadedUrls[field as keyof typeof uploadedUrls]) {
        newErrors[field] = t("credit.errors.fileRequired")
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      setIsSubmitting(true)
      try {
        onSubmit(uploadedUrls)
      } catch (err) {
        console.error("Form submission error:", err)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const renderFileUpload = (fieldName: string, label: string, required = true) => {
    const file = files[fieldName]
    const isUploading = uploading[fieldName]
    const progress = uploadProgress[fieldName] || 0
    const uploadedUrl = uploadedUrls[fieldName]

    return (
      <div className="border rounded-md p-4 relative">
        <Label htmlFor={fieldName} className="block mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>

        <div
          className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors ${
            errors[fieldName]
              ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
              : uploadedUrl
              ? "border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
              : "border-muted-foreground/30"
          }`}
        >
          <input
            type="file"
            id={fieldName}
            onChange={(e) => handleFileChange(e, fieldName)}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            disabled={isUploading}
          />
          <label htmlFor={fieldName} className="cursor-pointer block">
            {isUploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 text-primary mb-2 animate-spin" />
                <span className="text-sm font-medium">Téléversement en cours...</span>
                <Progress value={progress} className="h-2 w-full mt-2" />
                <span className="text-xs text-muted-foreground mt-1">{progress}%</span>
              </div>
            ) : uploadedUrl ? (
              <div className="flex flex-col items-center">
                <Check className="h-8 w-8 text-green-500 mb-2" />
                <span className="text-sm font-medium">{file?.name}</span>
                <span className="text-xs text-green-600 mt-1">Téléversé avec succès</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm">{t("credit.clickToUpload")}</span>
                <span className="text-xs text-muted-foreground mt-1">PDF, JPG ou PNG (max 5MB)</span>
              </div>
            )}
          </label>
        </div>

        {errors[fieldName] && (
          <div className="mt-2 flex items-center text-red-500 text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors[fieldName]}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="h-6 w-6 text-primary" />
        <motion.h2
          className="text-2xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t("credit.documentUpload")}
        </motion.h2>
      </div>

      <motion.div
        className="bg-blue-50 p-4 rounded-lg mb-8 text-sm dark:bg-blue-900/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0 dark:text-blue-400" />
          <div>
            <p className="font-medium text-blue-800 dark:text-blue-300">{t("credit.documentNote")}</p>
            <p className="mt-1 text-muted-foreground">{t("credit.documentInstructions")}</p>
            <p className="mt-1 text-blue-600 dark:text-blue-400">
              Les documents seront téléversés sur Cloudinary pour un stockage sécurisé.
            </p>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderFileUpload("cinRecto", t("credit.idCardFront"))}
          {renderFileUpload("cinVerso", t("credit.idCardBack"))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderFileUpload("bankStatements", t("credit.bankStatements"))}
          {renderFileUpload("taxDeclaration", t("credit.taxDeclaration"), false)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderFileUpload("incomeProof", t("credit.incomeProof"))}
          {renderFileUpload("businessRegistry", t("credit.businessRegistry"), false)}
        </div>

        <div className="grid grid-cols-1 gap-6">{renderFileUpload("residenceProof", t("credit.residenceProof"))}</div>

        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("credit.back")}
          </Button>

          <Button type="submit" disabled={isSubmitting || Object.keys(uploading).length > 0}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Traitement en cours...
              </>
            ) : (
              t("credit.submitApplication")
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
