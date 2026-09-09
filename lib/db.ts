import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db";
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

/**
 * Safe database connection verification helper
 */
export async function checkDatabaseConnection(): Promise<{ connected: boolean; error?: string }> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { connected: true };
  } catch (err: any) {
    return { connected: false, error: err?.message || "Unknown database error" };
  }
}

export default prisma;
