import { Router } from 'express';
import { createBooking, getBookings, getAvailability } from '../controllers/mahakalController';

const router = Router();

router.post('/booking', createBooking);
router.get('/bookings', getBookings);
router.get('/availability', getAvailability);

export default router;
