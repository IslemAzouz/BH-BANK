// models/Credit.js
import mongoose from 'mongoose';

const creditSchema = new mongoose.Schema({
  creditType: String,
  creditAmount: Number,
  duration: Number,
  monthlyPayment: Number,

  personalInfo: {
    firstName: String,
    lastName: String,
    cin: String,
    phone: String,
    email: String,
    dateOfBirth: String,
    address: String
  },

  professionalInfo: {
    profession: String,
    company: String,
    contractType: String,
    seniority: String
  },

  financialInfo: {
    monthlyIncome: Number,
    otherIncome: Number,
    loanAmount: Number,
    monthlyExpenses: Number
  },

  agencyInfo: {
    governorate: String,
    city: String,
    agency: String
  },
  
  status: {
    type: String,
    enum: ['en attente', 'approuvé', 'rejeté'],
    default: 'en attente',
  },
  
  rejectionReason: String,

  createdAt: {
    type: Date,
    default: Date.now
  },

  documents: {
    cinRecto: { type: String, default: null },
    cinVerso: { type: String, default: null },
    bankStatements: { type: String, default: null },
    taxDeclaration: { type: String, default: null },
    incomeProof: { type: String, default: null },
    businessRegistry: { type: String, default: null },
    residenceProof: { type: String, default: null }
  },
  
  // New fields for email and contract tracking
 emailSent: {
    type: Boolean,
    default: false
  },
  emailSentDate: Date,
  contractStatus: {
    type: String,
    enum: ['sent', 'viewed', 'signed', 'rejected'],
    default: 'sent'
  },
  contractUpdatedAt: Date,
  signatureData: mongoose.Schema.Types.Mixed,
  rejectionReason: String
});

export default mongoose.model('Credit', creditSchema);