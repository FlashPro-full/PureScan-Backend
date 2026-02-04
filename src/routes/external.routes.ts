import { Router } from "express";
import { getExternalScan } from "../controllers/scan.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get('/:barcode', authenticate, getExternalScan);

export default router;