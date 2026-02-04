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

const router = Router();

router.post('/', createAmazonHandler);
router.get('/admin/connect', getIsConnectedByAdminHandler);
router.get('/user/connect', getIsConnectedByUserHandler);
router.get('/limit', getIsLimitedHandler);
router.get('/', getAmazonHandler);
router.put('/:id', updateAmazonHandler);
router.delete('/:id', deleteAmazonHandler);

export default router;
