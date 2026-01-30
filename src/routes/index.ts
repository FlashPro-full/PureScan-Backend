import { Router } from 'express';

import authRoutes from './auth.routes';
import scanRoutes from './scan.routes';
import inventoryRoutes from './inventory.routes';
import settingsRoutes from './settings.routes';
import userRoutes from './user.routes';
import amazonRoutes from './amazon.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/account', userRoutes);
router.use('/scan', scanRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/settings', settingsRoutes);
router.use('/amazon', amazonRoutes);

export default router;