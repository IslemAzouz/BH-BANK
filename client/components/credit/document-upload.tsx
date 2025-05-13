"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Upload, FileText, Check, AlertCircle } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

interface DocumentUploadProps {
  onSubmit: () => void
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

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const selectedFile = e.target.files?.[0] || null

    setFiles((prev) => ({
      ...prev,
      [fieldName]: selectedFile,
    }))

    // Clear error when field is edited
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    const requiredFields = ["cinRecto", "cinVerso", "bankStatements", "incomeProof", "residenceProof"]

    requiredFields.forEach((field) => {
      if (!files[field]) {
        newErrors[field] = t("credit.errors.fileRequired")
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // In a real application, you would upload the files here
      onSubmit()
    }
  }

  const renderFileUpload = (fieldName: string, label: string, required = true) => {
    const file = files[fieldName]

    return (
      <div className="border rounded-md p-4 relative">
        <Label htmlFor={fieldName} className="block mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>

        <div
          className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors ${
            errors[fieldName]
              ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
              : file
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
          />

          <label htmlFor={fieldName} className="cursor-pointer block">
            {file ? (
              <div className="flex flex-col items-center">
                <Check className="h-8 w-8 text-green-500 mb-2" />
                <span className="text-sm font-medium">{file.name}</span>
                <span className="text-xs text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
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
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("credit.back")}
          </Button>

          <Button type="submit">{t("credit.submitApplication")}</Button>
        </div>
      </form>
    </div>
  )
}
