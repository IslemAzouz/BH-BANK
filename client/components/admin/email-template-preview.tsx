// components/admin/email-template-preview.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye } from 'lucide-react'

interface EmailTemplatePreviewProps {
  application: any
}

export function EmailTemplatePreview({ application }: EmailTemplatePreviewProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!application || !application.personalInfo) {
    return null
  }

  const recipientName = `${application.personalInfo.firstName} ${application.personalInfo.lastName}`
  const creditTypeName = getCreditTypeName(application.creditType)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Eye className="h-3 w-3" />
          <span>Aperçu de l'email</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Aperçu de l'email d'approbation</DialogTitle>
          <DialogDescription>Voici l'email qui sera envoyé au client avec le contrat de crédit.</DialogDescription>
        </DialogHeader>

        <div className="border rounded-md p-4 mt-4 bg-white">
          <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <img src="/images/logo.png" alt="BH Bank Logo" style={{ maxWidth: "150px" }} />
            </div>

            <h2 style={{ color: "#0066cc", marginBottom: "20px" }}>Félicitations, {recipientName}!</h2>

            <p>
              Nous sommes heureux de vous informer que votre demande de crédit a été{" "}
              <strong style={{ color: "#28a745" }}>approuvée</strong>.
            </p>

            <div style={{ backgroundColor: "#f8f9fa", padding: "15px", borderRadius: "5px", margin: "20px 0" }}>
              <h3 style={{ marginTop: 0, color: "#333" }}>Détails de votre crédit:</h3>
              <ul style={{ paddingLeft: "20px" }}>
                <li>
                  <strong>Type de crédit:</strong> {creditTypeName}
                </li>
                <li>
                  <strong>Montant approuvé:</strong> {application.creditAmount?.toLocaleString()} DT
                </li>
                <li>
                  <strong>Durée:</strong> {application.duration} mois
                </li>
                <li>
                  <strong>Mensualité:</strong> {application.monthlyPayment?.toFixed(2)} DT/mois
                </li>
              </ul>
            </div>

            <p>Veuillez trouver ci-joint le contrat de crédit à signer. Pour finaliser votre demande, veuillez:</p>

            <ol style={{ paddingLeft: "20px" }}>
              <li>Ouvrir le document PDF joint</li>
              <li>Lire attentivement toutes les conditions</li>
              <li>Signer électroniquement le document en suivant les instructions</li>
              <li>Nous renvoyer le document signé en répondant à cet email</li>
            </ol>

            <p>
              Si vous avez des questions concernant votre crédit ou le processus de signature, n'hésitez pas à nous
              contacter.
            </p>

            <div style={{ marginTop: "30px", paddingTop: "20px", borderTop: "1px solid #e0e0e0" }}>
              <p style={{ marginBottom: "5px" }}>
                <strong>Cordialement,</strong>
              </p>
              <p style={{ marginTop: 0 }}>L'équipe BH Bank</p>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={() => setIsOpen(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function getCreditTypeName(type: string) {
  switch (type) {
    case "CREDIT_CONSOMMATION":
      return "Crédit Consommation"
    case "CREDIT_AMENAGEMENT":
      return "Crédit Aménagement"
    case "CREDIT_ORDINATEUR":
      return "Crédit Ordinateur"
    default:
      return type
  }
}

export default EmailTemplatePreview