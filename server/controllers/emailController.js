const nodemailer = require('nodemailer');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs-extra');
const path = require('path');
const Credit = require('../models/Credit');
const jwt = require('jsonwebtoken');

// JWT verification middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: "Accès non autorisé. Token manquant." });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token invalide ou expiré." });
  }
};

// Controller for handling email and PDF operations
const emailController = {
  // Send approval email with PDF contract
  sendApprovalEmail: async (req, res) => {
    try {
      const { 
        applicationId, 
        recipientEmail, 
        recipientName, 
        creditType, 
        creditAmount, 
        duration, 
        monthlyPayment 
      } = req.body;

      if (!recipientEmail || !recipientName || !creditType || !creditAmount || !duration || !monthlyPayment) {
        return res.status(400).json({ error: "Informations manquantes pour l'envoi de l'email" });
      }

      // Generate PDF contract
      const pdfBytes = await generateCreditContractPDF({
        recipientName,
        creditType,
        creditAmount,
        duration,
        monthlyPayment
      });

      // Save PDF to disk (optional, for record keeping)
      const contractsDir = path.join(__dirname, '../contracts');
      await fs.ensureDir(contractsDir);
      const pdfPath = path.join(contractsDir, `contract_${applicationId}_${Date.now()}.pdf`);
      await fs.writeFile(pdfPath, pdfBytes);

      // Configure email transporter
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || "smtp.gmail.com",
        port: parseInt(process.env.EMAIL_PORT || "587"),
        secure: process.env.EMAIL_SECURE === "true",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      // Prepare email content
      const mailOptions = {
        from: `"BH Bank" <${process.env.EMAIL_USER}>`,
        to: recipientEmail,
        subject: "Votre demande de crédit a été approuvée - Contrat à signer",
        html: generateEmailHTML({
          recipientName,
          creditType: getCreditTypeName(creditType),
          creditAmount,
          duration,
          monthlyPayment
        }),
        attachments: [
          {
            filename: `Contrat_Credit_${recipientName.replace(/\s+/g, "_")}.pdf`,
            content: pdfBytes,
            contentType: "application/pdf",
          },
        ],
      };

      // Send email
      const info = await transporter.sendMail(mailOptions);

      // Update application email status in database
      await updateApplicationEmailStatus(applicationId, true);

      return res.status(200).json({ 
        success: true, 
        message: "Email envoyé avec succès", 
        messageId: info.messageId,
        pdfPath: pdfPath
      });
    } catch (err) {
      console.error("Erreur lors de l'envoi de l'email:", err);
      return res.status(500).json({ 
        error: "Erreur lors de l'envoi de l'email", 
        details: err.message 
      });
    }
  },

  // Resend contract email
  resendContractEmail: async (req, res) => {
    try {
      const { applicationId } = req.params;
      
      // Get application details from database
      const application = await Credit.findById(applicationId);
      
      if (!application) {
        return res.status(404).json({ error: "Demande de crédit non trouvée" });
      }
      
      // Parse application data
      const applicationData = {
        applicationId: application._id,
        recipientEmail: application.personalInfo.email,
        recipientName: `${application.personalInfo.firstName} ${application.personalInfo.lastName}`,
        creditType: application.creditType,
        creditAmount: application.creditAmount,
        duration: application.duration,
        monthlyPayment: application.monthlyPayment
      };
      
      // Call the send email function
      req.body = applicationData;
      return await emailController.sendApprovalEmail(req, res);
      
    } catch (err) {
      console.error("Erreur lors du renvoi de l'email:", err);
      return res.status(500).json({ 
        error: "Erreur lors du renvoi de l'email", 
        details: err.message 
      });
    }
  },
  
  // Track contract status (viewed, signed)
  trackContractStatus: async (req, res) => {
    try {
      const { applicationId } = req.params;
      const { status, signatureData } = req.body;
      
      // Update contract status in database
      await Credit.findByIdAndUpdate(applicationId, {
        contractStatus: status,
        contractUpdatedAt: new Date(),
        signatureData: signatureData || null
      });
      
      return res.status(200).json({ 
        success: true, 
        message: "Statut du contrat mis à jour avec succès" 
      });
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut du contrat:", err);
      return res.status(500).json({ 
        error: "Erreur lors de la mise à jour du statut du contrat", 
        details: err.message 
      });
    }
  }
};

// Helper Functions

// Function to generate PDF contract
async function generateCreditContractPDF(data) {
  const { recipientName, creditType, creditAmount, duration, monthlyPayment } = data;

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 format
  const { width, height } = page.getSize();

  // Add fonts
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Add title
  page.drawText("CONTRAT DE CRÉDIT", {
    x: 50,
    y: height - 50,
    size: 24,
    font: helveticaBold,
    color: rgb(0, 0.4, 0.7),
  });

  // Add date
  const currentDate = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  page.drawText(`Date: ${currentDate}`, {
    x: 50,
    y: height - 80,
    size: 12,
    font: helveticaFont,
  });

  // Add client information
  page.drawText("INFORMATIONS DU CLIENT", {
    x: 50,
    y: height - 120,
    size: 16,
    font: helveticaBold,
    color: rgb(0, 0.4, 0.7),
  });

  page.drawText(`Nom et prénom: ${recipientName}`, {
    x: 50,
    y: height - 150,
    size: 12,
    font: helveticaFont,
  });

  // Add credit details
  page.drawText("DÉTAILS DU CRÉDIT", {
    x: 50,
    y: height - 190,
    size: 16,
    font: helveticaBold,
    color: rgb(0, 0.4, 0.7),
  });

  const creditDetails = [
    `Type de crédit: ${getCreditTypeName(creditType)}`,
    `Montant du crédit: ${Number(creditAmount).toLocaleString()} DT`,
    `Durée du crédit: ${duration} mois`,
    `Mensualité: ${Number(monthlyPayment).toFixed(2)} DT/mois`,
    `Taux d'intérêt annuel: 8.5%`,
    `Frais de dossier: ${(Number(creditAmount) * 0.01).toFixed(2)} DT`,
  ];

  creditDetails.forEach((detail, index) => {
    page.drawText(detail, {
      x: 50,
      y: height - 220 - index * 25,
      size: 12,
      font: helveticaFont,
    });
  });

  // Add general conditions
  page.drawText("CONDITIONS GÉNÉRALES", {
    x: 50,
    y: height - 400,
    size: 16,
    font: helveticaBold,
    color: rgb(0, 0.4, 0.7),
  });

  const conditions = [
    "1. Le présent contrat est soumis aux conditions générales de la BH Bank.",
    "2. Le client s'engage à rembourser le crédit selon les modalités définies ci-dessus.",
    "3. En cas de retard de paiement, des pénalités seront appliquées conformément à la réglementation en vigueur.",
    "4. Le client peut rembourser par anticipation tout ou partie du crédit moyennant le paiement d'une indemnité.",
    "5. La BH Bank se réserve le droit de résilier le contrat en cas de non-respect des engagements du client.",
  ];

  conditions.forEach((condition, index) => {
    page.drawText(condition, {
      x: 50,
      y: height - 430 - index * 25,
      size: 10,
      font: helveticaFont,
    });
  });

  // Add signature section
  page.drawText("SIGNATURES", {
    x: 50,
    y: height - 600,
    size: 16,
    font: helveticaBold,
    color: rgb(0, 0.4, 0.7),
  });

  page.drawText("Pour la BH Bank:", {
    x: 50,
    y: height - 630,
    size: 12,
    font: helveticaFont,
  });

  page.drawText("Le client:", {
    x: 300,
    y: height - 630,
    size: 12,
    font: helveticaFont,
  });

  // Add frame for client signature
  page.drawRectangle({
    x: 300,
    y: height - 700,
    width: 200,
    height: 60,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });

  // Add footer
  page.drawText("BH Bank - Tous droits réservés", {
    x: width / 2 - 80,
    y: 30,
    size: 10,
    font: helveticaFont,
    color: rgb(0.5, 0.5, 0.5),
  });

  // Serialize document to bytes
  return await pdfDoc.save();
}

// Function to generate email HTML content
function generateEmailHTML(data) {
  const { recipientName, creditType, creditAmount, duration, monthlyPayment } = data;
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://www.bhbank.tn/images/logo.png" alt="BH Bank Logo" style="max-width: 150px;">
      </div>
      
      <h2 style="color: #0066cc; margin-bottom: 20px;">Félicitations, ${recipientName}!</h2>
      
      <p>Nous sommes heureux de vous informer que votre demande de crédit a été <strong style="color: #28a745;">approuvée</strong>.</p>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">Détails de votre crédit:</h3>
        <ul style="padding-left: 20px;">
          <li><strong>Type de crédit:</strong> ${creditType}</li>
          <li><strong>Montant approuvé:</strong> ${Number(creditAmount).toLocaleString()} DT</li>
          <li><strong>Durée:</strong> ${duration} mois</li>
          <li><strong>Mensualité:</strong> ${Number(monthlyPayment).toFixed(2)} DT/mois</li>
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
  `;
}

// Function to get credit type name
function getCreditTypeName(type) {
  switch (type) {
    case "CREDIT_CONSOMMATION":
      return "Crédit Consommation";
    case "CREDIT_AMENAGEMENT":
      return "Crédit Aménagement";
    case "CREDIT_ORDINATEUR":
      return "Crédit Ordinateur";
    default:
      return type;
  }
}

// Function to update application email status in database
async function updateApplicationEmailStatus(applicationId, emailSent) {
  try {
    // Update MongoDB document to track that an email has been sent
    await Credit.findByIdAndUpdate(applicationId, {
      emailSent: emailSent,
      emailSentDate: new Date()
    });
    
    return true;
  } catch (err) {
    console.error("Error updating application email status:", err);
    throw err;
  }
}

// Export the controller and middleware
module.exports = {
  emailController,
  verifyToken
};