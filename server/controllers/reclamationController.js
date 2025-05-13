import Reclamation from '../models/Reclamation.js';

export const createReclamation = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newReclamation = new Reclamation({ name, email, message });
    await newReclamation.save();
    res.status(201).json({ message: 'Reclamation created' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
export const getAllReclamations = async (req, res) => {
    try {
      const reclamations = await Reclamation.find().sort({ createdAt: -1 });
      res.status(200).json(reclamations);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors du chargement des réclamations." });
    }
  };
  