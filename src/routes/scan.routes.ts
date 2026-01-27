import express from 'express';
import { createScan, getScanList } from '../controllers/scan.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', authenticate, createScan);
router.get('/', authenticate, getScanList);

export default router;

