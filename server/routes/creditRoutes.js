import express from 'express';
import {
  createCredit,
  getAllCredits,
  getCreditById,
  updateCreditStatus,
  getCreditsByCin
} from '../controllers/creditController.js';

const router = express.Router();

router.post('/credits', createCredit);

router.get('/credits', getAllCredits);

router.get('/credits/:id', getCreditById);

router.put('/credits/:id/status', updateCreditStatus);

router.get('/credits/cin/:cin', getCreditsByCin);

export default router;
