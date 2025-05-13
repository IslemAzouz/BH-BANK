"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useTranslation } from "@/hooks/use-translation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Sun, Moon, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const { t, setLanguage, language } = useTranslation()
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)

    // Check if user is logged in
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setIsLoggedIn(false)
    window.location.href = "/"
  }

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/credit", label: t("nav.credit") }, // Add this line
    { href: "/contact", label: t("nav.contact") },
  ]

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-background"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/images/logo.png" alt="BH BANK Logo" width={120} height={40} priority />
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? "text-primary" : "text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <Globe className="h-5 w-5" />
                  <span className="sr-only">Changer de langue</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("fr")} className={language === "fr" ? "bg-accent" : ""}>
                  Français
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("en")} className={language === "en" ? "bg-accent" : ""}>
                  English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hidden md:flex"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Changer de thème</span>
            </Button>

            {isLoggedIn ? (
              <Button variant="default" onClick={handleLogout} className="hidden md:flex">
                {t("nav.logout")}
              </Button>
            ) : (
              <div className="hidden md:flex space-x-2">
                <Button variant="outline" asChild>
                  <Link href="/login">{t("nav.login")}</Link>
                </Button>
                <Button variant="default" asChild>
                  <Link href="/signup">{t("nav.signup")}</Link>
                </Button>
              </div>
            )}

            <Button variant="ghost" size="icon" onClick={toggleMenu} className="md:hidden">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background border-t"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      pathname === link.href ? "text-primary" : "text-foreground"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center justify-between pt-4 border-t">
                <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                  {theme === "dark" ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                  {theme === "dark" ? t("nav.lightMode") : t("nav.darkMode")}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Globe className="h-4 w-4 mr-2" />
                      {language === "fr" ? "Français" : "English"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setLanguage("fr")}>Français</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {isLoggedIn ? (
                <Button variant="default" onClick={handleLogout} className="w-full">
                  {t("nav.logout")}
                </Button>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/login">{t("nav.login")}</Link>
                  </Button>
                  <Button variant="default" asChild className="w-full">
                    <Link href="/signup">{t("nav.signup")}</Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
