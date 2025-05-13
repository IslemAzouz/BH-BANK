// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import creditRoutes from './routes/creditRoutes.js';
import reclamationRoutes from './routes/reclamationRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/req', creditRoutes); 
app.use('/api/rec', reclamationRoutes);


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
