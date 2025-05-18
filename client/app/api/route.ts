import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { recipientEmail, recipientName, creditType, creditAmount, duration, monthlyPayment } = data

    if (!recipientEmail || !recipientName || !creditType || !creditAmount || !duration || !monthlyPayment) {
      return NextResponse.json({ error: "Informations manquantes pour l'envoi de l'email" }, { status: 400 })
    }

    // Générer le PDF du contrat
    const pdfBytes = await generateCreditContractPDF(data)

    // Configurer le transporteur d'email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number.parseInt(process.env.EMAIL_PORT || "587"),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    // Préparer le contenu de l'email
    const mailOptions = {
      from: `"BH Bank" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: "Votre demande de crédit a été approuvée - Contrat à signer",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://www.bhbank.tn/images/logo.png" alt="BH Bank Logo" style="max-width: 150px;">
          </div>
          
          <h2 style="color: #0066cc; margin-bottom: 20px;">Félicitations, ${recipientName}!</h2>
          
          <p>Nous sommes heureux de vous informer que votre demande de crédit a été <strong style="color: #28a745;">approuvée</strong>.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Détails de votre crédit:</h3>
            <ul style="padding-left: 20px;">
              <li><strong>Type de crédit:</strong> ${getCreditTypeName(creditType)}</li>
              <li><strong>Montant approuvé:</strong> ${creditAmount.toLocaleString()} DT</li>
              <li><strong>Durée:</strong> ${duration} mois</li>
              <li><strong>Mensualité:</strong> ${monthlyPayment.toFixed(2)} DT/mois</li>
            </ul>
          </div>
          
          <p>Veuillez trouver ci-joint le contrat de crédit à signer. Pour finaliser votre demande, veuillez:</p>
          
          <ol style="padding-left: 20px;">
            <li>Ouvrir le document PDF joint</li>
            <li>Lire attentivement toutes les conditions</li>
            <li>Signer électroniquement le document en suivant les instructions</li>
            <li>Nous renvoyer le document signé en répondant à cet email</li>
          </ol>
          
          <p>Si vous avez des questions concernant votre crédit ou le processus de signature, n'hésitez pas à nous contacter au <strong>+216 71 126 000</strong> ou par email à <a href="mailto:contact@bhbank.tn" style="color: #0066cc;">contact@bhbank.tn</a>.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="margin-bottom: 5px;"><strong>Cordialement,</strong></p>
            <p style="margin-top: 0;">L'équipe BH Bank</p>
          </div>
          
          <div style="margin-top: 30px; font-size: 12px; color: #6c757d; text-align: center;">
            <p>Ce message est automatique, merci de ne pas y répondre directement.</p>
            <p>© ${new Date().getFullYear()} BH Bank. Tous droits réservés.</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `Contrat_Credit_${recipientName.replace(/\s+/g, "_")}.pdf`,
          content: Buffer.from(pdfBytes),
          contentType: "application/pdf",
        },
      ],
    }

    // Envoyer l'email
    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true, message: "Email envoyé avec succès" })
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error)
    return NextResponse.json({ error: "Erreur lors de l'envoi de l'email", details: error }, { status: 500 })
  }
}

// Fonction pour générer le PDF du contrat
async function generateCreditContractPDF(data: any) {
  const { recipientName, creditType, creditAmount, duration, monthlyPayment } = data

  // Créer un nouveau document PDF
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595.28, 841.89]) // Format A4
  const { width, height } = page.getSize()

  // Ajouter les polices
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

  // Ajouter le titre
  page.drawText("CONTRAT DE CRÉDIT", {
    x: 50,
    y: height - 50,
    size: 24,
    font: helveticaBold,
    color: rgb(0, 0.4, 0.7),
  })

  // Ajouter la date
  const currentDate = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  page.drawText(`Date: ${currentDate}`, {
    x: 50,
    y: height - 80,
    size: 12,
    font: helveticaFont,
  })

  // Ajouter les informations du client
  page.drawText("INFORMATIONS DU CLIENT", {
    x: 50,
    y: height - 120,
    size: 16,
    font: helveticaBold,
    color: rgb(0, 0.4, 0.7),
  })

  page.drawText(`Nom et prénom: ${recipientName}`, {
    x: 50,
    y: height - 150,
    size: 12,
    font: helveticaFont,
  })

  // Ajouter les détails du crédit
  page.drawText("DÉTAILS DU CRÉDIT", {
    x: 50,
    y: height - 190,
    size: 16,
    font: helveticaBold,
    color: rgb(0, 0.4, 0.7),
  })

  const creditDetails = [
    `Type de crédit: ${getCreditTypeName(creditType)}`,
    `Montant du crédit: ${creditAmount.toLocaleString()} DT`,
    `Durée du crédit: ${duration} mois`,
    `Mensualité: ${monthlyPayment.toFixed(2)} DT/mois`,
    `Taux d'intérêt annuel: 8.5%`,
    `Frais de dossier: ${(creditAmount * 0.01).toFixed(2)} DT`,
  ]

  creditDetails.forEach((detail, index) => {
    page.drawText(detail, {
      x: 50,
      y: height - 220 - index * 25,
      size: 12,
      font: helveticaFont,
    })
  })

  // Ajouter les conditions générales
  page.drawText("CONDITIONS GÉNÉRALES", {
    x: 50,
    y: height - 400,
    size: 16,
    font: helveticaBold,
    color: rgb(0, 0.4, 0.7),
  })

  const conditions = [
    "1. Le présent contrat est soumis aux conditions générales de la BH Bank.",
    "2. Le client s'engage à rembourser le crédit selon les modalités définies ci-dessus.",
    "3. En cas de retard de paiement, des pénalités seront appliquées conformément à la réglementation en vigueur.",
    "4. Le client peut rembourser par anticipation tout ou partie du crédit moyennant le paiement d'une indemnité.",
    "5. La BH Bank se réserve le droit de résilier le contrat en cas de non-respect des engagements du client.",
  ]

  conditions.forEach((condition, index) => {
    page.drawText(condition, {
      x: 50,
      y: height - 430 - index * 25,
      size: 10,
      font: helveticaFont,
    })
  })

  // Ajouter la section signature
  page.drawText("SIGNATURES", {
    x: 50,
    y: height - 600,
    size: 16,
    font: helveticaBold,
    color: rgb(0, 0.4, 0.7),
  })

  page.drawText("Pour la BH Bank:", {
    x: 50,
    y: height - 630,
    size: 12,
    font: helveticaFont,
  })

  page.drawText("Le client:", {
    x: 300,
    y: height - 630,
    size: 12,
    font: helveticaFont,
  })

  // Ajouter un cadre pour la signature du client
  page.drawRectangle({
    x: 300,
    y: height - 700,
    width: 200,
    height: 60,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  })

  // Ajouter le pied de page
  page.drawText("BH Bank - Tous droits réservés", {
    x: width / 2 - 80,
    y: 30,
    size: 10,
    font: helveticaFont,
    color: rgb(0.5, 0.5, 0.5),
  })

  // Sérialiser le document en bytes
  return await pdfDoc.save()
}

// Fonction pour obtenir le nom du type de crédit
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
