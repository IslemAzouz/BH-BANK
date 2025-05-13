const User = require('../models/User');
const jwt = require('jsonwebtoken');

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, admin: user.admin },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { email, password, RIB, CIN } = req.body;
    if (!email || !password || !RIB || !CIN)
      return res.status(400).json({ error: 'Tous les champs sont requis.' });

    const emailExists = await User.findOne({ email });
    const cinExists = await User.findOne({ CIN });

    if (emailExists) return res.status(400).json({ error: 'Email déjà utilisé.' });
    if (cinExists) return res.status(400).json({ error: 'CIN déjà utilisé.' });

    const user = await User.create({ email, password, RIB, CIN, admin: 0 });
    const token = createToken(user);

    res.status(201).json({
      message: 'Inscription réussie',
      user: { id: user._id, email: user.email, admin: user.admin },
      token
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur du serveur' });
  }
};

exports.login = async (req, res) => {
  try {
    const { CIN, RIB } = req.body;
    if (!CIN || !RIB) return res.status(400).json({ error: 'CIN et RIB requis.' });

    const user = await User.findOne({ CIN });
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });
    if (user.RIB !== RIB) return res.status(401).json({ error: 'RIB incorrect.' });

    const token = createToken(user);
    res.status(200).json({
      message: 'Connexion réussie',
      user: { id: user._id, email: user.email, admin: user.admin },
      token
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
