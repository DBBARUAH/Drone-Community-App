-- Add missing columns to Profile table
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "title" TEXT;

-- Add any other missing columns if needed
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "location" TEXT;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "website" TEXT;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "bio" TEXT;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "contactEmail" TEXT;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "phone" TEXT;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "businessName" TEXT;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "specializations" TEXT[] DEFAULT '{}';
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "serviceArea" TEXT;
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "languages" TEXT[] DEFAULT '{}';
ALTER TABLE "Profile" ADD COLUMN IF NOT EXISTS "insuranceDetails" TEXT; 