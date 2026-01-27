import { Router } from 'express';

import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import scanRoutes from './scan.routes';
import inventoryRoutes from './inventory.routes';
import settingsRoutes from './settings.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/scans', scanRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/settings', settingsRoutes);

export default router;