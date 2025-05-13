"use client"

import { useTranslation } from "@/hooks/use-translation"
import { motion } from "framer-motion"
import { CreditCard, Landmark, PiggyBank, BarChart4, Shield, Users } from "lucide-react"

export default function ServicesSection() {
  const { t } = useTranslation()

  const services = [
    {
      icon: <CreditCard className="h-10 w-10 text-primary" />,
      title: t("services.cards.title"),
      description: t("services.cards.description"),
    },
    {
      icon: <Landmark className="h-10 w-10 text-primary" />,
      title: t("services.accounts.title"),
      description: t("services.accounts.description"),
    },
    {
      icon: <PiggyBank className="h-10 w-10 text-primary" />,
      title: t("services.savings.title"),
      description: t("services.savings.description"),
    },
    {
      icon: <BarChart4 className="h-10 w-10 text-primary" />,
      title: t("services.investments.title"),
      description: t("services.investments.description"),
    },
    {
      icon: <Shield className="h-10 w-10 text-primary" />,
      title: t("services.insurance.title"),
      description: t("services.insurance.description"),
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: t("services.business.title"),
      description: t("services.business.description"),
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("services.title")}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("services.subtitle")}</p>
        </div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-card p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              variants={itemVariants}
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-muted-foreground">{service.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
