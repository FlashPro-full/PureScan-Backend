import { Router } from 'express';

import authRoutes from './auth.routes';
import scanRoutes from './scan.routes';
import inventoryRoutes from './inventory.routes';
import settingsRoutes from './settings.routes';
import userRoutes from './user.routes';
import amazonRoutes from './amazon.routes';
import externalRoutes from './external.routes';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use('/auth', authRoutes);
router.use('/account', authenticate, userRoutes);
router.use('/scan', authenticate, scanRoutes);
router.use('/inventory', authenticate, inventoryRoutes);
router.use('/settings', authenticate, settingsRoutes);
router.use('/amazon', authenticate, amazonRoutes);
router.use('/external', authenticate, externalRoutes);

export default router;