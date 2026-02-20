import express from 'express';
import { createScanHandler, getScanListHandler, deleteScanHandler, getScanListPaginationHandler, searchCatalogHandler } from '../controllers/scan.controller';

const router = express.Router();

router.post('/', createScanHandler);
router.post('/search', searchCatalogHandler);
router.get('/', getScanListHandler);
router.get('/export', getScanListPaginationHandler);
router.delete('/:id', deleteScanHandler);

export default router;

