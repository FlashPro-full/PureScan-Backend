import { Router } from 'express';
import {
    createTriggerHandler,
    getTriggerHandler,
    updateTriggerHandler,
    setDefaultTriggerHandler,
    updateEnabledHandler,
    updateDisabledMissingHandler,
    updateDisplayHandler
} from '../controllers/trigger.controller';

const router = Router();

router.post('/create', createTriggerHandler);
router.post('/fetch', getTriggerHandler);
router.post('/default', setDefaultTriggerHandler);
router.put('/:id/config', updateTriggerHandler);
router.put('/:id/enabled', updateEnabledHandler);
router.put('/:id/missing', updateDisabledMissingHandler);
router.put('/:id/display', updateDisplayHandler);

export default router;