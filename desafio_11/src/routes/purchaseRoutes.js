import express from 'express';
import PurchaseController from '../controllers/productsController.js';

const router = express.Router();


router.post('/ticket', PurchaseController.createTicket);

export default router;