"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, DollarSign, CreditCard } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

interface FinancialInfoFormProps {
  onSubmit: (data: any) => void
  onBack: () => void
  initialData: any
}

export default function FinancialInfoForm({ onSubmit, onBack, initialData }: FinancialInfoFormProps) {
  const { t } = useTranslation()

  const [formData, setFormData] = useState({
    monthlyIncome: initialData.monthlyIncome || "",
    otherIncome: initialData.otherIncome || "",
    hasLoans: false,
    loanAmount: initialData.loanAmount || "",
    monthlyExpenses: initialData.monthlyExpenses || "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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

    if (!formData.monthlyIncome) newErrors.monthlyIncome = t("credit.errors.required")
    else if (isNaN(Number(formData.monthlyIncome))) newErrors.monthlyIncome = t("credit.errors.invalidNumber")

    if (formData.otherIncome && isNaN(Number(formData.otherIncome)))
      newErrors.otherIncome = t("credit.errors.invalidNumber")

    if (formData.hasLoans && !formData.loanAmount) newErrors.loanAmount = t("credit.errors.required")
    else if (formData.loanAmount && isNaN(Number(formData.loanAmount)))
      newErrors.loanAmount = t("credit.errors.invalidNumber")

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
      <motion.div
        className="bg-blue-50 p-6 rounded-lg mb-8 dark:bg-blue-900/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <DollarSign className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">{t("credit.financialInfo")}</h2>
        </div>
        <p className="text-muted-foreground">{t("credit.financialInfoDescription")}</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            {t("credit.monthlyIncome")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="monthlyIncome">{t("credit.netMonthlyIncome")} *</Label>
              <div className="relative">
                <Input
                  id="monthlyIncome"
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={handleChange}
                  placeholder="0"
                  className={`pl-8 ${errors.monthlyIncome ? "border-red-500" : ""}`}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">DT</span>
              </div>
              {errors.monthlyIncome && <p className="text-sm text-red-500">{errors.monthlyIncome}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="otherIncome">{t("credit.otherIncome")}</Label>
              <div className="relative">
                <Input
                  id="otherIncome"
                  name="otherIncome"
                  value={formData.otherIncome}
                  onChange={handleChange}
                  placeholder="0"
                  className={`pl-8 ${errors.otherIncome ? "border-red-500" : ""}`}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">DT</span>
              </div>
              {errors.otherIncome && <p className="text-sm text-red-500">{errors.otherIncome}</p>}
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            {t("credit.financialCommitments")}
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasLoans"
                  name="hasLoans"
                  checked={formData.hasLoans}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="hasLoans" className="ml-2 block text-sm">
                  {t("credit.hasLoans")}
                </label>
              </div>
            </div>

            {formData.hasLoans && (
              <div className="space-y-2 pl-6 border-l-2 border-muted">
                <Label htmlFor="loanAmount">{t("credit.currentLoansAmount")}</Label>
                <div className="relative">
                  <Input
                    id="loanAmount"
                    name="loanAmount"
                    value={formData.loanAmount}
                    onChange={handleChange}
                    placeholder="0"
                    className={`pl-8 ${errors.loanAmount ? "border-red-500" : ""}`}
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">DT</span>
                </div>
                {errors.loanAmount && <p className="text-sm text-red-500">{errors.loanAmount}</p>}
              </div>
            )}
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
