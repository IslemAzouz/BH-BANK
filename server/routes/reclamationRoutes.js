import express from 'express';
import { createReclamation, getAllReclamations } from '../controllers/reclamationController.js';

const router = express.Router();

router.post('/post', createReclamation);
router.get('/get', getAllReclamations);

export default router;
