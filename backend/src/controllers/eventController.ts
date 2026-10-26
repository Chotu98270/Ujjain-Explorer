import { Request, Response } from 'express';
import { prisma, isDbAvailable } from '../services/dbHealth';
import { getDynamicUjjainEvents, UjjainEventItem } from '../data/ujjainPlaces';

// In-memory user-submitted dynamic events store
const customUpcomingEvents: UjjainEventItem[] = [];

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const { month, timeframe, category, simDate } = req.query;
    const baseDate = simDate ? new Date(String(simDate)) : new Date();

    let events = [...getDynamicUjjainEvents(baseDate), ...customUpcomingEvents];

    // Filter by timeframe: 'this_month' | 'next_month' | 'upcoming'
    if (timeframe && timeframe !== 'all') {
      events = events.filter((e) => e.timeframe === timeframe);
    }

    // Filter by month name (e.g. 'january', 'february', 'november')
    if (month && month !== 'all') {
      events = events.filter((e) =>
        e.monthName.toLowerCase() === String(month).toLowerCase()
      );
    }

    // Filter by category (e.g. 'concert', 'comedy', 'festival')
    if (category && category !== 'all') {
      events = events.filter((e) =>
        e.category.toLowerCase().includes(String(category).toLowerCase())
      );
    }

    // Return chronologically sorted events
    return res.json(events.sort((a, b) => a.daysLeft - b.daysLeft));
  } catch (error) {
    return res.json(getDynamicUjjainEvents());
  }
};

export const addEvent = async (req: Request, res: Response) => {
  try {
    const { name, artist, category, venue, time, ticket, desc, daysAhead, date } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Event name is required' });
    }

    const baseDate = new Date();
    const daysOffset = Number(daysAhead) || 15;
    const targetDate = date ? new Date(date) : new Date(baseDate.getTime() + daysOffset * 24 * 60 * 60 * 1000);
    const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const FULL_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const day = String(targetDate.getDate()).padStart(2, "0");
    const month = MONTHS[targetDate.getMonth()];
    const year = targetDate.getFullYear();
    const fullMonth = FULL_MONTHS[targetDate.getMonth()];
    const diffTime = targetDate.getTime() - baseDate.getTime();
    const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    let timeframe: 'this_month' | 'next_month' | 'upcoming' = 'upcoming';
    if (targetDate.getMonth() === baseDate.getMonth() && targetDate.getFullYear() === baseDate.getFullYear()) {
      timeframe = 'this_month';
    } else if (
      (targetDate.getMonth() === (baseDate.getMonth() + 1) % 12) &&
      (targetDate.getFullYear() === baseDate.getFullYear() || (baseDate.getMonth() === 11 && targetDate.getFullYear() === baseDate.getFullYear() + 1))
    ) {
      timeframe = 'next_month';
    }

    const newEvent: UjjainEventItem = {
      id: Date.now(),
      name,
      artist: artist || "Guest Artist",
      category: category || "Celebrity Concert",
      badge: "⭐ NEW EVENT",
      venue: venue || "Ujjain Open Arena",
      time: time || "07:00 PM Onwards",
      ticket: ticket || "Passes on Partner Site",
      desc: desc || `Upcoming live event featuring ${artist || name} in Ujjain.`,
      color: "saffron",
      date: `${month} ${day}, ${year}`,
      daysLeft,
      timeframe,
      monthName: fullMonth,
      year,
      countdown: `In ${daysLeft} days`
    };

    customUpcomingEvents.unshift(newEvent);

    return res.status(201).json({ success: true, event: newEvent });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to add event' });
  }
};
