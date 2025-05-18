// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import creditRoutes from './routes/creditRoutes.js';
import reclamationRoutes from './routes/reclamationRoutes.js';
import emailRoutes from './routes/emailRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Create contracts directory if it doesn't exist
const contractsDir = path.join(__dirname, 'contracts');
fs.ensureDirSync(contractsDir);

// Serve static files from the contracts directory
app.use('/contracts', express.static(contractsDir));

app.use('/api/auth', authRoutes);
app.use('/api/req', creditRoutes); 
app.use('/api/rec', reclamationRoutes);
app.use('/api/email', emailRoutes); // Add the new email routes

app.get("/", (req, res) => {
  res.send("API is running...");
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Server running on http://localhost:${process.env.PORT || 5000}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
});