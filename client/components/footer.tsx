"use client"

import Link from "next/link"
import Image from "next/image"
import { useTranslation } from "@/hooks/use-translation"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  const { t } = useTranslation()

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image src="/images/logo.png" alt="BH BANK Logo" width={150} height={50} />
            </Link>
            <p className="text-muted-foreground mb-4">{t("footer.description")}</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("nav.contact")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.services")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.careers")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">{t("footer.services")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.personalBanking")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.businessBanking")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.loans")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.investments")}
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  {t("footer.insurance")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">{t("footer.contact")}</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 text-primary" />
                <span className="text-muted-foreground">18 Avenue Mohamed V, Tunis 1023, Tunisie</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-primary" />
                <span className="text-muted-foreground">+216 71 126 000</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-primary" />
                <span className="text-muted-foreground">contact@bhbank.tn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} BH BANK. {t("footer.allRightsReserved")}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t("footer.termsOfService")}
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t("footer.privacyPolicy")}
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t("footer.cookies")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
