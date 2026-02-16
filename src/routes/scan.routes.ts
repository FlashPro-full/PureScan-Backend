import express from 'express';
import { createScanHandler, getScanListHandler, deleteScanHandler, getScanListPaginationHandler } from '../controllers/scan.controller';

const router = express.Router();

router.post('/', createScanHandler);
router.get('/', getScanListHandler);
router.get('/export', getScanListPaginationHandler);
router.delete('/:id', deleteScanHandler);

export default router;

