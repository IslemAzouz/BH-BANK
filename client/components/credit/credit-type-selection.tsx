"use client"

import { motion } from "framer-motion"
import { ShoppingCart, Home, Laptop } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"

interface CreditTypeSelectionProps {
  onSelect: (creditType: string) => void
}

export default function CreditTypeSelection({ onSelect }: CreditTypeSelectionProps) {
  const { t } = useTranslation()

  const creditTypes = [
    {
      id: "CREDIT_CONSOMMATION",
      name: "CREDIT CONSOMMATION",
      icon: <ShoppingCart className="h-12 w-12 text-primary" />,
      description: "Financement sans objet",
      maxAmount: null,
      minDuration: 12,
      maxDuration: 36,
      clientTypes: ["salarié secteur public", "salarié secteur privé", "profession libérale", "retraité"],
    },
    {
      id: "CREDIT_AMENAGEMENT",
      name: "CREDIT AMENAGEMENT",
      icon: <Home className="h-12 w-12 text-primary" />,
      description: "Financement avec objet (devis/facture pro format requis)",
      maxAmount: null,
      minDuration: 37,
      maxDuration: 84,
      clientTypes: [
        "salarié secteur public titulaire",
        "salarié secteur public contractuel",
        "salarié secteur privé",
        "profession libérale",
        "retraité",
      ],
    },
    {
      id: "CREDIT_ORDINATEUR",
      name: "CREDIT ORDINATEUR",
      icon: <Laptop className="h-12 w-12 text-primary" />,
      description: "Financement avec objet (facture pro format requise)",
      maxAmount: 2500,
      minDuration: 12,
      maxDuration: 36,
      clientTypes: [
        "salarié secteur public titulaire",
        "salarié secteur public contractuel",
        "salarié secteur privé",
        "profession libérale",
        "retraité",
      ],
    },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <motion.h2
        className="text-2xl font-bold text-center text-primary mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {t("credit.selectType")}
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {creditTypes.map((credit) => (
          <motion.div
            key={credit.id}
            className={`border rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow text-center flex flex-col items-center ${
              credit.id === "CREDIT_ORDINATEUR"
                ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800"
                : "bg-card"
            }`}
            onClick={() => onSelect(credit.id)}
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4">{credit.icon}</div>
            <h3 className="font-bold text-lg mb-2">{credit.name}</h3>
            <p className="text-sm text-muted-foreground mb-4">{credit.description}</p>

            {credit.maxAmount && (
              <div className="mt-auto">
                <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded dark:bg-red-900/30 dark:text-red-300">
                  Plafond: {credit.maxAmount} DT
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
