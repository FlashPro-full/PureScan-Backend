import express from 'express';
import { lookupProduct } from '../controllers/product.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/lookup', authenticate, lookupProduct);

export default router;

