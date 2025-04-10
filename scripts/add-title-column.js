import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addTitleColumn() {
  try {
    console.log('Attempting to add title column to Profile table...');
    
    // Execute raw SQL to add the column if it doesn't exist
    await prisma.$executeRaw`
      ALTER TABLE "Profile" 
      ADD COLUMN IF NOT EXISTS "title" TEXT;
    `;
    
    console.log('Successfully added title column to Profile table');
  } catch (error) {
    console.error('Failed to add title column:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addTitleColumn(); 