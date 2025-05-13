import Credit from '../models/Credit.js';

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

// ✅ Update the status (approve/reject)
export const updateCreditStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['en attente', 'approuvé', 'rejeté'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Statut invalide." });
    }

    const updatedCredit = await Credit.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedCredit) {
      return res.status(404).json({ message: "Crédit non trouvé." });
    }

    res.status(200).json(updatedCredit);
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
