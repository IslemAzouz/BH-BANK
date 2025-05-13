"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"
import { translations } from "@/translations"

type Language = "fr" | "en"

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

export const LanguageContext = createContext<LanguageContextType>({
  language: "fr",
  setLanguage: () => {},
  t: () => "",
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("fr")

  useEffect(() => {
    // Check if there's a saved language preference
    const savedLanguage = localStorage.getItem("language") as Language | null
    if (savedLanguage && (savedLanguage === "fr" || savedLanguage === "en")) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string) => {
    // Split the key by dots to access nested properties
    const keys = key.split(".")
    let value: any = translations[language]

    // Navigate through the nested properties
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k]
      } else {
        // Return the key if translation is not found
        return key
      }
    }

    return value
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}
