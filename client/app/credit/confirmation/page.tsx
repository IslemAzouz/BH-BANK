"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Home, FileText } from "lucide-react"
import { useTranslation } from "@/hooks/use-translation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function CreditConfirmationPage() {
  const { t } = useTranslation()
  const router = useRouter()

  // Generate a random application number
  const applicationNumber = `BH-${Math.floor(100000 + Math.random() * 900000)}`

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0)
  }, [])

  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-12">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-6">
            <CheckCircle2 className="h-20 w-20 text-green-500" />
          </div>

          <h1 className="text-3xl font-bold mb-4">{t("credit.confirmation.title")}</h1>

          <p className="text-lg text-muted-foreground mb-8">{t("credit.confirmation.message")}</p>

          <div className="bg-muted p-6 rounded-lg mb-8">
            <p className="text-sm text-muted-foreground mb-2">{t("credit.confirmation.applicationNumber")}</p>
            <p className="text-2xl font-bold text-primary">{applicationNumber}</p>
          </div>

          <div className="bg-card border p-6 rounded-lg mb-8 text-left">
            <h2 className="text-lg font-semibold mb-4">{t("credit.confirmation.nextSteps")}</h2>

            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-3 mt-0.5">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium">{t("credit.confirmation.step1Title")}</p>
                  <p className="text-sm text-muted-foreground">{t("credit.confirmation.step1Description")}</p>
                </div>
              </li>

              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-3 mt-0.5">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium">{t("credit.confirmation.step2Title")}</p>
                  <p className="text-sm text-muted-foreground">{t("credit.confirmation.step2Description")}</p>
                </div>
              </li>

              <li className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-full mr-3 mt-0.5">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium">{t("credit.confirmation.step3Title")}</p>
                  <p className="text-sm text-muted-foreground">{t("credit.confirmation.step3Description")}</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => router.push("/")} className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              {t("credit.confirmation.backToHome")}
            </Button>

            <Button onClick={() => router.push("/credit")} className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              {t("credit.confirmation.newApplication")}
            </Button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </main>
  )
}
