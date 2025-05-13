"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowLeft, LightbulbIcon } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

interface CreditSimulationProps {
  creditType: string
  onComplete: (data: any) => void
  onBack: () => void
}

export default function CreditSimulation({ creditType, onComplete, onBack }: CreditSimulationProps) {
  const { t } = useTranslation()

  // Default values based on credit type
  const getDefaultValues = () => {
    switch (creditType) {
      case "CREDIT_ORDINATEUR":
        return { maxAmount: 2500, minDuration: 12, maxDuration: 36 }
      case "CREDIT_AMENAGEMENT":
        return { maxAmount: 20000, minDuration: 37, maxDuration: 84 }
      case "CREDIT_CONSOMMATION":
        return { maxAmount: 30000, minDuration: 12, maxDuration: 36 }
      default:
        return { maxAmount: 10000, minDuration: 12, maxDuration: 36 }
    }
  }

  const defaults = getDefaultValues()

  const [amount, setAmount] = useState(creditType === "CREDIT_ORDINATEUR" ? 2500 : 10000)
  const [duration, setDuration] = useState(creditType === "CREDIT_ORDINATEUR" ? 36 : 24)
  const [clientType, setClientType] = useState("salarié secteur public titulaire")
  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [annualRate, setAnnualRate] = useState(0)

  // TMM (Taux Moyen du Marché Monétaire) - this would typically come from an API
  const TMM = 7.25

  useEffect(() => {
    // Calculate rate based on credit type
    let rate = 0
    switch (creditType) {
      case "CREDIT_ORDINATEUR":
        rate = TMM + 3 // TMM + 3%
        break
      case "CREDIT_AMENAGEMENT":
        rate = TMM + 4 // TMM + 4%
        break
      case "CREDIT_CONSOMMATION":
        rate = TMM + 5 // TMM + 5%
        break
      default:
        rate = TMM + 4
    }

    setAnnualRate(rate)

    // Calculate monthly payment
    // Formula: P = A * (r * (1 + r)^n) / ((1 + r)^n - 1)
    // where P = monthly payment, A = loan amount, r = monthly interest rate, n = number of payments

    const monthlyRate = rate / 100 / 12
    const numberOfPayments = duration

    const monthlyPaymentValue =
      (amount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

    // Add insurance (0.5% annually)
    const insuranceMonthly = (amount * 0.005) / 12

    setMonthlyPayment(Math.round((monthlyPaymentValue + insuranceMonthly) * 100) / 100)
  }, [amount, duration, creditType])

  const handleContinue = () => {
    onComplete({
      amount,
      duration,
      clientType,
      monthlyPayment,
      annualRate,
    })
  }

  return (
    <div className="max-w-3xl mx-auto bg-card rounded-xl p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-full dark:bg-blue-900/30">
          <LightbulbIcon className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-xl font-bold">{t("credit.parameters")}</h2>
      </div>

      <div className="space-y-8">
        <div>
          <div className="flex justify-between mb-2">
            <label className="font-medium">{t("credit.amount")} (DT)</label>
            <span className="text-sm text-muted-foreground">
              {defaults.maxAmount ? `(Maximum: ${defaults.maxAmount} DT)` : ""}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Slider
                value={[amount]}
                min={1000}
                max={defaults.maxAmount || 30000}
                step={100}
                onValueChange={(value) => setAmount(value[0])}
              />
            </div>
            <div className="w-24 text-right font-semibold text-primary">{amount} DT</div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="font-medium">{t("credit.duration")} (mois)</label>
            <span className="text-sm text-muted-foreground">
              (De {defaults.minDuration} à {defaults.maxDuration} mois)
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Slider
                value={[duration]}
                min={defaults.minDuration}
                max={defaults.maxDuration}
                step={1}
                onValueChange={(value) => setDuration(value[0])}
              />
            </div>
            <div className="w-24 text-right font-semibold text-primary">{duration} mois</div>
          </div>
        </div>

        <div>
          <label className="font-medium block mb-2">{t("credit.clientType")}</label>
          <Select value={clientType} onValueChange={setClientType}>
            <SelectTrigger>
              <SelectValue placeholder={t("credit.selectClientType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="salarié secteur public titulaire">Salarié secteur public titulaire</SelectItem>
              <SelectItem value="salarié secteur public contractuel">Salarié secteur public contractuel</SelectItem>
              <SelectItem value="salarié secteur privé">Salarié secteur privé</SelectItem>
              <SelectItem value="profession libérale">Profession libérale</SelectItem>
              <SelectItem value="retraité">Retraité</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <motion.div
          className="bg-blue-50 rounded-lg p-6 dark:bg-blue-900/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-4 text-center">{t("credit.summary")}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-md shadow-sm dark:bg-card">
              <div className="text-sm text-muted-foreground mb-1">{t("credit.annualRate")}</div>
              <div className="text-xl font-bold text-primary">
                TMM ({TMM}%) + {annualRate - TMM}% = {annualRate}%
              </div>
            </div>

            <div className="bg-white p-4 rounded-md shadow-sm dark:bg-card">
              <div className="text-sm text-muted-foreground mb-1">{t("credit.monthlyPayment")}</div>
              <div className="text-xl font-bold text-green-600 dark:text-green-500">
                {monthlyPayment.toFixed(2)} DT/mois
                <span className="text-xs text-muted-foreground ml-1">(incl. assurance)</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white rounded-md shadow-sm text-sm dark:bg-card">
            <div className="font-medium mb-2">{t("credit.specificConditions")}:</div>
            {creditType === "CREDIT_ORDINATEUR" && (
              <p>
                Facture pro format obligatoire. Plafond: 2500 DT. Documents: CNI, bulletins de salaire, RIB, facture
              </p>
            )}
            {creditType === "CREDIT_AMENAGEMENT" && (
              <p>Devis obligatoire. Autofinancement: 0%. Documents: CNI, bulletins de salaire, RIB, devis</p>
            )}
            {creditType === "CREDIT_CONSOMMATION" && (
              <p>Éligibilité: CDI ou ancienneté {">"} 1 an. Documents: CNI, bulletins de salaire, RIB</p>
            )}
          </div>
        </motion.div>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("credit.back")}
        </Button>

        <Button onClick={handleContinue}>{t("credit.continue")}</Button>
      </div>
    </div>
  )
}
