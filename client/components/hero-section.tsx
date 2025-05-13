"use client"

import { useTranslation } from "@/hooks/use-translation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"

export default function HeroSection() {
  const { t } = useTranslation()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
  }, [])

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-background z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              {t("hero.title")}
            </motion.h1>

            <motion.p
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Button size="lg" asChild>
                <Link href={isLoggedIn ? "/dashboard" : "/login"}>
                  {isLoggedIn ? t("dashboard.myCredits") : t("hero.getStarted")}
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about">{t("hero.learnMore")}</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="relative"
          >
            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl">
              <Image src="/images/about.jpg" alt="BH BANK Services" fill className="object-cover" />
            </div>

            <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-lg shadow-lg max-w-[280px]">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-1.81 0L3.1 4.13a2.12 2.12 0 0 0-.05 3.69l12.22 6.93a2 2 0 0 0 1.94 0L21 12.51a2.12 2.12 0 0 0-.09-3.67Z"></path>
                    <path d="m3.09 8.84 12.35-6.61a1.93 1.93 0 0 1 1.81 0l3.65 1.9a2.12 2.12 0 0 1 .1 3.69L8.73 14.75a2 2 0 0 1-1.94 0L3 12.51a2.12 2.12 0 0 1 .09-3.67Z"></path>
                    <line x1="12" y1="22" x2="12" y2="13"></line>
                    <path d="M20 13.5v3.37a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13.5"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">{t("hero.card.title")}</h3>
                  <p className="text-sm text-muted-foreground">{t("hero.card.subtitle")}</p>
                </div>
              </div>
              <p className="text-sm">{t("hero.card.description")}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
