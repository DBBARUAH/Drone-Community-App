import { db } from './db';

// Example function that uses the Prisma client
export async function getUserWithProfile(userId: string): Promise<any> {
  if (!userId) {
    return null;
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      profile: true, // Include the related profile data
    },
  });

  return user;
} 