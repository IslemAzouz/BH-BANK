"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Briefcase } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

interface ProfessionalInfoFormProps {
  onSubmit: (data: any) => void
  onBack: () => void
  initialData: any
}

export default function ProfessionalInfoForm({ onSubmit, onBack, initialData }: ProfessionalInfoFormProps) {
  const { t } = useTranslation()

  const [formData, setFormData] = useState({
    profession: initialData.profession || "",
    company: initialData.company || "",
    contractType: initialData.contractType || "",
    seniority: initialData.seniority || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.profession) newErrors.profession = t("credit.errors.required")
    if (!formData.company.trim()) newErrors.company = t("credit.errors.required")
    if (!formData.seniority.trim()) newErrors.seniority = t("credit.errors.required")

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Briefcase className="h-6 w-6 text-primary" />
        <motion.h2
          className="text-2xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t("credit.professionalInfo")}
        </motion.h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="profession">{t("credit.profession")} *</Label>
          <Select value={formData.profession} onValueChange={(value) => handleSelectChange("profession", value)}>
            <SelectTrigger className={errors.profession ? "border-red-500" : ""}>
              <SelectValue placeholder={t("credit.selectProfession")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Salarié">Salarié</SelectItem>
              <SelectItem value="Profession libérale">Profession libérale</SelectItem>
              <SelectItem value="Fonctionnaire">Fonctionnaire</SelectItem>
              <SelectItem value="Artisan">Artisan</SelectItem>
              <SelectItem value="Commerçant">Commerçant</SelectItem>
              <SelectItem value="Retraité">Retraité</SelectItem>
              <SelectItem value="Autre">Autre</SelectItem>
            </SelectContent>
          </Select>
          {errors.profession && <p className="text-sm text-red-500">{errors.profession}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">{t("credit.company")}</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder={t("credit.companyPlaceholder")}
            className={errors.company ? "border-red-500" : ""}
          />
          {errors.company && <p className="text-sm text-red-500">{errors.company}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contractType">{t("credit.contractType")}</Label>
          <Select value={formData.contractType} onValueChange={(value) => handleSelectChange("contractType", value)}>
            <SelectTrigger>
              <SelectValue placeholder={t("credit.selectContractType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CDI">CDI</SelectItem>
              <SelectItem value="CDD">CDD</SelectItem>
              <SelectItem value="Fonctionnaire">Fonctionnaire</SelectItem>
              <SelectItem value="Indépendant">Indépendant</SelectItem>
              <SelectItem value="Autre">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="seniority">{t("credit.seniority")} (années) *</Label>
          <Input
            id="seniority"
            name="seniority"
            value={formData.seniority}
            onChange={handleChange}
            placeholder="Ex: 5"
            className={errors.seniority ? "border-red-500" : ""}
          />
          {errors.seniority && <p className="text-sm text-red-500">{errors.seniority}</p>}
        </div>

        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("credit.back")}
          </Button>

          <Button type="submit">{t("credit.continue")}</Button>
        </div>
      </form>
    </div>
  )
}
