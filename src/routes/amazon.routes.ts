import { Router } from 'express';
import {
    createAmazonHandler,
    getTotalAmazonCountHandler,
    getAmazonHandler,
    updateAmazonHandler,
    deleteAmazonHandler
} from '../controllers/amazon.controller';

import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, createAmazonHandler);
router.get('/total', authenticate, getTotalAmazonCountHandler);
router.get('/', authenticate, getAmazonHandler);
router.put('/:id', authenticate, updateAmazonHandler);
router.delete('/:id', authenticate, deleteAmazonHandler);

export default router;
