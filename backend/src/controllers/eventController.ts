import { Request, Response } from 'express';
import { prisma, isDbAvailable } from '../services/dbHealth';
import { UJJAIN_EVENTS } from '../data/ujjainPlaces';

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const dbOk = await isDbAvailable();
    if (dbOk) {
      try {
        const events = await prisma.event.findMany({
          orderBy: { id: 'asc' }
        });
        if (events && events.length > 0) {
          return res.json(events);
        }
      } catch (dbErr) {
        // Fall back to in-memory events
      }
    }
    // High-speed fallback
    return res.json(UJJAIN_EVENTS);
  } catch (error) {
    return res.json(UJJAIN_EVENTS);
  }
};
