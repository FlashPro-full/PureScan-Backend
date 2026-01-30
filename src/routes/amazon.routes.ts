import { Router } from 'express';
import {
    createAmazonHandler,
    getIsConnectedByUserHandler,
    getIsConnectedByAdminHandler,
    getAmazonHandler,
    updateAmazonHandler,
    deleteAmazonHandler,
    getIsLimitedHandler
} from '../controllers/amazon.controller';

import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createAmazonHandler);
router.get('/admin/connect', authenticate, getIsConnectedByAdminHandler);
router.get('/user/connect', authenticate, getIsConnectedByUserHandler);
router.get('/limit', authenticate, getIsLimitedHandler);
router.get('/', authenticate, getAmazonHandler);
router.put('/:id', authenticate, updateAmazonHandler);
router.delete('/:id', authenticate, deleteAmazonHandler);

export default router;
