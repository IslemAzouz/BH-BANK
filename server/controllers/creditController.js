// controllers/creditController.js
import Credit from '../models/Credit.js';
import axios from 'axios';

export const createCredit = async (req, res) => {
  try {
    const newCredit = new Credit(req.body);
    const savedCredit = await newCredit.save();
    res.status(201).json(savedCredit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la création de la demande de crédit." });
  }
};

export const getAllCredits = async (req, res) => {
  try {
    const credits = await Credit.find().sort({ createdAt: -1 });
    res.status(200).json(credits);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération des crédits." });
  }
};

export const getCreditById = async (req, res) => {
  try {
    const credit = await Credit.findById(req.params.id);
    if (!credit) {
      return res.status(404).json({ message: "Crédit non trouvé." });
    }
    res.status(200).json(credit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération du crédit." });
  }
};

// Updated to include email sending when approved
export const updateCreditStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const allowedStatuses = ['en attente', 'approuvé', 'rejeté'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Statut invalide." });
    }

    const updateData = { status };
    
    // Add rejection reason if status is rejected
    if (status === 'rejeté' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const updatedCredit = await Credit.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedCredit) {
      return res.status(404).json({ message: "Crédit non trouvé." });
    }

    // If approved, send email with contract
    if (status === 'approuvé') {
      try {
        // Prepare application data for email
        const applicationData = {
          applicationId: updatedCredit._id,
          recipientEmail: updatedCredit.personalInfo.email,
          recipientName: `${updatedCredit.personalInfo.firstName} ${updatedCredit.personalInfo.lastName}`,
          creditType: updatedCredit.creditType,
          creditAmount: updatedCredit.creditAmount,
          duration: updatedCredit.duration,
          monthlyPayment: updatedCredit.monthlyPayment
        };
        
        // Call email service
        await axios.post(
          `${process.env.API_BASE_URL || 'http://localhost:5000'}/api/email/send-approval-email`,
          applicationData,
          {
            headers: {
              'Authorization': req.headers.authorization // Forward auth token
            }
          }
        );
        
        console.log('Email sent successfully for credit application:', updatedCredit._id);
      } catch (emailError) {
        console.error("Error sending approval email:", emailError);
        // Continue with the response even if email fails
      }
    }

    res.status(200).json({
      credit: updatedCredit,
      emailSent: status === 'approuvé'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la mise à jour du statut." });
  }
};

export const getCreditsByCin = async (req, res) => {
  const { cin } = req.params;

  try {
    const credits = await Credit.find({ 'personalInfo.cin': cin });
    if (!credits || credits.length === 0) {
      return res.status(404).json({ message: 'Aucun crédit trouvé pour ce CIN.' });
    }
    res.status(200).json(credits);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la récupération des crédits par CIN." });
  }
};