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

  createdAt: {
    type: Date,
    default: Date.now
  },


});

export default mongoose.model('Credit', creditSchema);
