"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

interface StepIndicatorProps {
  currentStep: number
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const { t } = useTranslation()

  const steps = [
    { id: 1, name: t("credit.steps.simulation") },
    { id: 2, name: t("credit.steps.personal") },
    { id: 3, name: t("credit.steps.professional") },
    { id: 4, name: t("credit.steps.financial") },
    { id: 5, name: t("credit.steps.agency") },
    { id: 6, name: t("credit.steps.documents") },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* Step circle */}
            <motion.div
              className={`flex items-center justify-center h-10 w-10 rounded-full ${
                step.id < currentStep
                  ? "bg-green-500 text-white"
                  : step.id === currentStep
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: step.id === currentStep ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            >
              {step.id < currentStep ? <Check className="h-5 w-5" /> : <span>{step.id}</span>}
            </motion.div>

            {/* Step name */}
            <div className="ml-3">
              <p
                className={`text-sm font-medium ${step.id === currentStep ? "text-primary" : "text-muted-foreground"}`}
              >
                {step.name}
              </p>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4">
                <div className={`h-0.5 ${step.id < currentStep ? "bg-green-500" : "bg-muted"}`}></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile view */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step) => (
            <motion.div
              key={step.id}
              className={`flex items-center justify-center h-8 w-8 rounded-full ${
                step.id < currentStep
                  ? "bg-green-500 text-white"
                  : step.id === currentStep
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: step.id === currentStep ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            >
              {step.id < currentStep ? <Check className="h-4 w-4" /> : <span className="text-xs">{step.id}</span>}
            </motion.div>
          ))}
        </div>

        <p className="text-center text-sm font-medium text-primary">
          {steps.find((step) => step.id === currentStep)?.name}
        </p>
      </div>
    </div>
  )
}
