import { Request, Response } from 'express';

export interface MahakalBooking {
  id: string;
  bookingRef: string;
  type: 'bhasma_aarti' | 'vip_darshan';
  date: string;
  slot: string;
  category?: string;
  devoteesCount: number;
  primaryDevotee: {
    name: string;
    phone: string;
    aadhaar?: string;
    age?: number;
    gender?: string;
  };
  totalAmount: number;
  entryGate: string;
  reportingTime: string;
  status: 'CONFIRMED' | 'PENDING';
  createdAt: string;
}

const bookingsStore: MahakalBooking[] = [];

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { type, date, slot, category, devoteesCount, primaryDevotee } = req.body;

    if (!type || !date || !primaryDevotee?.name || !primaryDevotee?.phone) {
      return res.status(400).json({ error: 'Missing required booking details (type, date, name, phone)' });
    }

    const count = Number(devoteesCount) || 1;
    const isBhasma = type === 'bhasma_aarti';
    const totalAmount = isBhasma ? 0 : count * 250;
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const bookingRef = isBhasma ? `MHKL-BA-${randomDigits}` : `MHKL-VIP-${randomDigits}`;

    const newBooking: MahakalBooking = {
      id: `bk_${Date.now()}`,
      bookingRef,
      type,
      date,
      slot: slot || (isBhasma ? '04:00 AM - 06:00 AM' : 'Morning Slot (06:00 AM - 12:00 PM)'),
      category: category || (isBhasma ? 'Nandi Hall' : 'VIP Sheegra Darshan'),
      devoteesCount: count,
      primaryDevotee: {
        name: primaryDevotee.name,
        phone: primaryDevotee.phone,
        aadhaar: primaryDevotee.aadhaar || 'Verified on Arrival',
        age: primaryDevotee.age,
        gender: primaryDevotee.gender,
      },
      totalAmount,
      entryGate: isBhasma ? 'Gate No. 1 (Bhasma Aarti Entrance)' : 'Gate No. 4 (VIP Sheegra Darshan Lane, Bada Ganesh Side)',
      reportingTime: isBhasma ? '03:00 AM (Sharp)' : '30 mins before chosen slot',
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
    };

    bookingsStore.unshift(newBooking);

    return res.status(201).json({
      success: true,
      message: `${isBhasma ? 'Bhasma Aarti' : 'VIP Sheegra Darshan'} booking confirmed successfully!`,
      booking: newBooking,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal server error processing booking' });
  }
};

export const getBookings = async (req: Request, res: Response) => {
  try {
    return res.json({ success: true, bookings: bookingsStore });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve bookings' });
  }
};

export const getAvailability = async (req: Request, res: Response) => {
  try {
    const { date } = req.query;
    return res.json({
      date: date || new Date().toISOString().split('T')[0],
      bhasmaAarti: {
        nandiHallAvailable: 42,
        barricadeAvailable: 168,
        status: 'OPEN',
      },
      vipDarshan: {
        morningSlots: 185,
        afternoonSlots: 240,
        eveningSlots: 195,
        nightSlots: 150,
        feePerPerson: 250,
        status: 'OPEN',
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to retrieve availability' });
  }
};
