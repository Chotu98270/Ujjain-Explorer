import { Router } from 'express';
import { getAllEvents, addEvent } from '../controllers/eventController';

const router = Router();

router.get('/', getAllEvents);
router.post('/', addEvent);

export default router;
