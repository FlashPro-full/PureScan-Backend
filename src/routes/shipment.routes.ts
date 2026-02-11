import { Router } from "express";
import { createShipmentHandler, getShipmentListHandler, updateCurrentShipmentHandler } from "../controllers/shipment.controller";

const router = Router();

router.post('/', createShipmentHandler);
router.get('/', getShipmentListHandler);
router.put('/', updateCurrentShipmentHandler);

export default router;