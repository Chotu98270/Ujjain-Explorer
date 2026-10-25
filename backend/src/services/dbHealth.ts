import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

let isConnected = false;
let lastCheckTime = 0;
const CHECK_INTERVAL_MS = 15000; // 15 seconds cooldown between checks

export const isDbAvailable = async (): Promise<boolean> => {
  const now = Date.now();
  if (now - lastCheckTime < CHECK_INTERVAL_MS) {
    return isConnected;
  }

  lastCheckTime = now;
  try {
    const probe = prisma.$queryRaw`SELECT 1`;
    const timeout = new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error('DB connection timeout')), 350)
    );
    await Promise.race([probe, timeout]);
    isConnected = true;
    return true;
  } catch {
    isConnected = false;
    return false;
  }
};
