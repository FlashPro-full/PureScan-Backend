import { Router } from 'express';

import authRoutes from './auth.routes';
import scanRoutes from './scan.routes';
import settingsRoutes from './settings.routes';
import userRoutes from './user.routes';
import shipmentRoutes from './shipment.routes';
import triggerRoutes from './trigger.routes';

import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use('/auth', authRoutes);
router.use('/account', authenticate, userRoutes);
router.use('/scan', authenticate, scanRoutes);
router.use('/settings', authenticate, settingsRoutes);
router.use('/shipment', authenticate, shipmentRoutes);
router.use('/trigger', authenticate, triggerRoutes);

export default router;