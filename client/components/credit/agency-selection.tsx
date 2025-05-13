"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Building } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

interface AgencySelectionProps {
  onSubmit: (data: any) => void
  onBack: () => void
  initialData: any
}

export default function AgencySelection({ onSubmit, onBack, initialData }: AgencySelectionProps) {
  const { t } = useTranslation()

  const [formData, setFormData] = useState({
    governorate: initialData.governorate || "",
    city: initialData.city || "",
    agency: initialData.agency || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Mock data - in a real app, this would come from an API
  const governorates = [
    "Tunis",
    "Ariana",
    "Ben Arous",
    "Manouba",
    "Nabeul",
    "Zaghouan",
    "Bizerte",
    "Béja",
    "Jendouba",
    "Kef",
    "Siliana",
    "Sousse",
    "Monastir",
    "Mahdia",
    "Sfax",
    "Kairouan",
    "Kasserine",
    "Sidi Bouzid",
    "Gabès",
    "Medenine",
    "Tataouine",
    "Gafsa",
    "Tozeur",
    "Kebili",
  ]

  const cities: Record<string, string[]> = {
    Tunis: ["Tunis", "Le Bardo", "La Goulette", "Le Kram", "La Marsa"],
    Ariana: ["Ariana", "La Soukra", "Raoued", "Kalâat el-Andalous", "Sidi Thabet"],
    // Add more cities for each governorate
  }

  const agencies: Record<string, string[]> = {
    Tunis: ["Agence Principale", "Agence Bab Bhar", "Agence El Menzah", "Agence Lac"],
    "Le Bardo": ["Agence Bardo"],
    // Add more agencies for each city
  }

  const handleSelectChange = (name: string, value: string) => {
    // If changing governorate, reset city and agency
    if (name === "governorate") {
      setFormData({
        governorate: value,
        city: "",
        agency: "",
      })
    }
    // If changing city, reset agency
    else if (name === "city") {
      setFormData({
        ...formData,
        city: value,
        agency: "",
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }

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

    if (!formData.governorate) newErrors.governorate = t("credit.errors.required")
    if (!formData.city) newErrors.city = t("credit.errors.required")
    if (!formData.agency) newErrors.agency = t("credit.errors.required")

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
        <Building className="h-6 w-6 text-primary" />
        <motion.h2
          className="text-2xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t("credit.agencySelection")}
        </motion.h2>
      </div>

      <motion.div
        className="bg-blue-50 p-4 rounded-lg mb-8 text-sm dark:bg-blue-900/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {t("credit.agencyInfo")}
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="governorate">{t("credit.governorate")}</Label>
          <Select value={formData.governorate} onValueChange={(value) => handleSelectChange("governorate", value)}>
            <SelectTrigger className={errors.governorate ? "border-red-500" : ""}>
              <SelectValue placeholder={t("credit.selectGovernorate")} />
            </SelectTrigger>
            <SelectContent>
              {governorates.map((gov) => (
                <SelectItem key={gov} value={gov}>
                  {gov}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.governorate && <p className="text-sm text-red-500">{errors.governorate}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">{t("credit.city")}</Label>
          <Select
            value={formData.city}
            onValueChange={(value) => handleSelectChange("city", value)}
            disabled={!formData.governorate}
          >
            <SelectTrigger className={errors.city ? "border-red-500" : ""}>
              <SelectValue placeholder={t("credit.selectCity")} />
            </SelectTrigger>
            <SelectContent>
              {formData.governorate && cities[formData.governorate] ? (
                cities[formData.governorate].map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  {t("credit.selectGovernorateFirst")}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="agency">{t("credit.agency")}</Label>
          <Select
            value={formData.agency}
            onValueChange={(value) => handleSelectChange("agency", value)}
            disabled={!formData.city}
          >
            <SelectTrigger className={errors.agency ? "border-red-500" : ""}>
              <SelectValue placeholder={t("credit.selectAgency")} />
            </SelectTrigger>
            <SelectContent>
              {formData.city && agencies[formData.city] ? (
                agencies[formData.city].map((agency) => (
                  <SelectItem key={agency} value={agency}>
                    {agency}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="none" disabled>
                  {t("credit.selectCityFirst")}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {errors.agency && <p className="text-sm text-red-500">{errors.agency}</p>}
        </div>

        <div className="bg-muted/30 p-6 rounded-lg mt-8">
          <h3 className="font-semibold mb-4">{t("credit.finalSteps")}</h3>
          <ul className="space-y-2 list-disc list-inside text-muted-foreground">
            <li>{t("credit.step1")}</li>
            <li>{t("credit.step2")}</li>
            <li>{t("credit.step3")}</li>
          </ul>
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
