"use client"

import { motion } from "framer-motion"
import { useTranslation } from "@/hooks/use-translation"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Home, Laptop, ArrowRight, Percent, Clock, Shield } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function CreditSection() {
  const { t } = useTranslation()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
  }, [])

  const creditTypes = [
    {
      id: "CREDIT_CONSOMMATION",
      name: "CREDIT CONSOMMATION",
      icon: <ShoppingCart className="h-10 w-10 text-primary" />,
      description: "Financement sans objet",
      features: [
        { icon: <Percent className="h-4 w-4" />, text: "TMM + 5%" },
        { icon: <Clock className="h-4 w-4" />, text: "12 à 36 mois" },
      ],
    },
    {
      id: "CREDIT_AMENAGEMENT",
      name: "CREDIT AMENAGEMENT",
      icon: <Home className="h-10 w-10 text-primary" />,
      description: "Financement avec objet (devis/facture pro format requis)",
      features: [
        { icon: <Percent className="h-4 w-4" />, text: "TMM + 4%" },
        { icon: <Clock className="h-4 w-4" />, text: "37 à 84 mois" },
      ],
    },
    {
      id: "CREDIT_ORDINATEUR",
      name: "CREDIT ORDINATEUR",
      icon: <Laptop className="h-10 w-10 text-primary" />,
      description: "Financement avec objet (facture pro format requise)",
      features: [
        { icon: <Percent className="h-4 w-4" />, text: "TMM + 3%" },
        { icon: <Clock className="h-4 w-4" />, text: "12 à 36 mois" },
        { icon: <Shield className="h-4 w-4" />, text: "Plafond: 2500 DT" },
      ],
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("creditSection.title")}</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{t("creditSection.subtitle")}</p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {creditTypes.map((credit) => (
            <motion.div
              key={credit.id}
              className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              variants={itemVariants}
            >
              <div className="p-6 border-b">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 p-3 rounded-full">{credit.icon}</div>
                  <h3 className="text-xl font-bold">{credit.name}</h3>
                </div>
                <p className="text-muted-foreground">{credit.description}</p>
              </div>

              <div className="p-6">
                <ul className="space-y-3 mb-6">
                  {credit.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <span className="text-primary">{feature.icon}</span>
                      {feature.text}
                    </li>
                  ))}
                </ul>

                <Button asChild className="w-full">
                  <Link href={isLoggedIn ? "/dashboard" : "/login"}>
                    {t("creditSection.applyNow")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="bg-primary/5 rounded-xl p-8 max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">{t("creditSection.whyChooseUs")}</h3>
            <ul className="grid md:grid-cols-3 gap-6 text-left">
              <li className="flex flex-col">
                <div className="font-medium mb-1">{t("creditSection.advantages.simple")}</div>
                <p className="text-sm text-muted-foreground">{t("creditSection.advantages.simpleDesc")}</p>
              </li>
              <li className="flex flex-col">
                <div className="font-medium mb-1">{t("creditSection.advantages.fast")}</div>
                <p className="text-sm text-muted-foreground">{t("creditSection.advantages.fastDesc")}</p>
              </li>
              <li className="flex flex-col">
                <div className="font-medium mb-1">{t("creditSection.advantages.secure")}</div>
                <p className="text-sm text-muted-foreground">{t("creditSection.advantages.secureDesc")}</p>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
