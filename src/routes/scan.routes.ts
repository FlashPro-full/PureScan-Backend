import express from 'express';
import { createScan, getScanList } from '../controllers/scan.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', createScan);
router.get('/', getScanList);

export default router;

