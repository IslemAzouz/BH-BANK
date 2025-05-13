"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

interface PersonalInfoFormProps {
  onSubmit: (data: any) => void
  onBack: () => void
  initialData: any
}

export default function PersonalInfoForm({ onSubmit, onBack, initialData }: PersonalInfoFormProps) {
  const { t } = useTranslation()

  const [formData, setFormData] = useState({
    firstName: initialData.firstName || "",
    lastName: initialData.lastName || "",
    cin: initialData.cin || "",
    phone: initialData.phone || "",
    email: initialData.email || "",
    dateOfBirth: initialData.dateOfBirth || "",
    address: initialData.address || "",
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = t("credit.errors.required")
    if (!formData.lastName.trim()) newErrors.lastName = t("credit.errors.required")
    if (!formData.cin.trim()) newErrors.cin = t("credit.errors.required")
    if (!formData.phone.trim()) newErrors.phone = t("credit.errors.required")
    if (!formData.email.trim()) newErrors.email = t("credit.errors.required")
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t("credit.errors.invalidEmail")
    if (!formData.dateOfBirth.trim()) newErrors.dateOfBirth = t("credit.errors.required")
    if (!formData.address.trim()) newErrors.address = t("credit.errors.required")

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
      <motion.h2
        className="text-2xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {t("credit.personalInfo")}
      </motion.h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="lastName">{t("credit.lastName")}</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder={t("credit.lastNamePlaceholder")}
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName">{t("credit.firstName")}</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder={t("credit.firstNamePlaceholder")}
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t("credit.phone")}</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="8 chiffres"
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cin">{t("credit.cin")}</Label>
            <Input
              id="cin"
              name="cin"
              value={formData.cin}
              onChange={handleChange}
              placeholder="8 chiffres"
              className={errors.cin ? "border-red-500" : ""}
            />
            {errors.cin && <p className="text-sm text-red-500">{errors.cin}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("credit.email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t("credit.emailPlaceholder")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">{t("credit.dateOfBirth")}</Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={errors.dateOfBirth ? "border-red-500" : ""}
            />
            {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">{t("credit.address")}</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder={t("credit.addressPlaceholder")}
            className={errors.address ? "border-red-500" : ""}
          />
          {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="confirmAccuracy"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="confirmAccuracy" className="ml-2 block text-sm text-muted-foreground">
              {t("credit.confirmAccuracy")}
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="acceptTerms"
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="acceptTerms" className="ml-2 block text-sm text-muted-foreground">
              {t("credit.acceptTerms")}
            </label>
          </div>
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
