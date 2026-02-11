import express from 'express';
import { createScanHandler, getScanListHandler, deleteScanHandler } from '../controllers/scan.controller';

const router = express.Router();

router.post('/', createScanHandler);
router.get('/', getScanListHandler);
router.delete('/:id', deleteScanHandler);

export default router;

