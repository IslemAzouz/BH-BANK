"use client"

import { motion } from "framer-motion"
import { useTranslation } from "@/hooks/use-translation"

interface CreditSummaryProps {
  creditType: string
  amount: number
  duration: number
  monthlyPayment: number
}

export default function CreditSummary({ creditType, amount, duration, monthlyPayment }: CreditSummaryProps) {
  const { t } = useTranslation()

  const getCreditTypeName = () => {
    switch (creditType) {
      case "CREDIT_CONSOMMATION":
        return "CREDIT CONSOMMATION"
      case "CREDIT_AMENAGEMENT":
        return "CREDIT AMENAGEMENT"
      case "CREDIT_ORDINATEUR":
        return "CREDIT ORDINATEUR"
      default:
        return creditType
    }
  }

  return (
    <motion.div
      className="max-w-3xl mx-auto bg-blue-50 p-4 rounded-lg dark:bg-blue-900/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-wrap gap-2 items-center justify-center text-sm">
        <span className="font-medium">{t("credit.type")}:</span>
        <span className="font-bold text-primary">{getCreditTypeName()}</span>

        <span className="mx-2">|</span>

        <span className="font-medium">{t("credit.amount")}:</span>
        <span className="font-bold">{amount} DT</span>

        <span className="mx-2">|</span>

        <span className="font-medium">{t("credit.duration")}:</span>
        <span className="font-bold">
          {duration} {t("credit.months")}
        </span>

        <span className="mx-2">|</span>

        <span className="font-medium">{t("credit.monthlyPayment")}:</span>
        <span className="font-bold text-green-600 dark:text-green-500">{monthlyPayment.toFixed(2)} DT</span>
      </div>
    </motion.div>
  )
}
