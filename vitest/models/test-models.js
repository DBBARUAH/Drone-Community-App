// Test database model queries using pg directly
import pkg from 'pg';
import 'dotenv/config';

const { Pool } = pkg;

console.log(`Using database connection: ${process.env.DATABASE_URL ? 'DATABASE_URL is set' : 'DATABASE_URL is NOT set!'}`);

// Create a timeout id so we can clear it when the script completes normally
let timeoutId = setTimeout(() => {
  console.error('Test timeout after 30 seconds - terminating...');
  process.exit(1);
}, 30000); // 30 second timeout

// Create a pg pool with the pooler connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Helper function for executing queries
async function executeQuery(query, params = []) {
  const client = await pool.connect();
  try {
    return await client.query(query, params);
  } finally {
    client.release();
  }
}

// Helper to generate unique IDs for tests
function generateTestId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
}

async function main() {
  // Store IDs of created test items for cleanup
  let testUser, testProfile, testCategory, testGalleryItem, testExperience, testEquipment, testCertification;
  const testUserEmail = 'test-models@example.com'; // Use a specific email for this test
  
  try {
    console.log('Testing database models with direct pg connection...');
    
    // --- Cleanup potentially existing test data first ---
    console.log('\n--- Cleaning up old test data (if any) ---');
    // Delete in reverse order of creation / dependency
    await executeQuery('DELETE FROM "GalleryItem" WHERE "profileId" IN (SELECT id FROM "Profile" WHERE "userId" IN (SELECT id FROM "User" WHERE email = $1)) ', [testUserEmail]);
    await executeQuery('DELETE FROM "Category" WHERE "profileId" IN (SELECT id FROM "Profile" WHERE "userId" IN (SELECT id FROM "User" WHERE email = $1)) ', [testUserEmail]);
    await executeQuery('DELETE FROM "Experience" WHERE "profileId" IN (SELECT id FROM "Profile" WHERE "userId" IN (SELECT id FROM "User" WHERE email = $1)) ', [testUserEmail]);
    await executeQuery('DELETE FROM "Equipment" WHERE "profileId" IN (SELECT id FROM "Profile" WHERE "userId" IN (SELECT id FROM "User" WHERE email = $1)) ', [testUserEmail]);
    await executeQuery('DELETE FROM "Certification" WHERE "profileId" IN (SELECT id FROM "Profile" WHERE "userId" IN (SELECT id FROM "User" WHERE email = $1)) ', [testUserEmail]);
    await executeQuery('DELETE FROM "Profile" WHERE "userId" IN (SELECT id FROM "User" WHERE email = $1) ', [testUserEmail]);
    await executeQuery('DELETE FROM "User" WHERE email = $1', [testUserEmail]);
    console.log('Cleanup complete.');
    
    // Check what tables exist in the database
    console.log('\n--- Database Tables ---');
    const tablesResult = await executeQuery(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    tablesResult.rows.forEach(table => {
      console.log(`- ${table.table_name}`);
    });
    
    // Count users
    console.log('\n--- User Table ---');
    const userCountResult = await executeQuery('SELECT COUNT(*) FROM "User"');
    console.log(`User count: ${userCountResult.rows[0].count}`);
    
    // --- Test User --- 
    console.log('\n--- Testing User Model ---');
    const userId = generateTestId('user');
    const userInsertResult = await executeQuery(
      'INSERT INTO "User" (id, "auth0Id", email, name, role, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING * ',
      [userId, `auth0|${userId}`, testUserEmail, 'Test Models User', 'CLIENT', new Date(), new Date()]
    );
    testUser = userInsertResult.rows[0];
    console.log(`Created User: ${testUser.id}`);
    const userFindResult = await executeQuery('SELECT * FROM "User" WHERE id = $1', [testUser.id]);
    expect(userFindResult.rows.length).toBe(1);
    expect(userFindResult.rows[0].email).toBe(testUserEmail);
    console.log('User Read Verified.');
    // Update test is implicit via Profile tests
    // Delete test is handled in finally block

    // --- Test Profile --- 
    console.log('\n--- Testing Profile Model ---');
    const profileId = generateTestId('profile');
    const profileInsertResult = await executeQuery(
      'INSERT INTO "Profile" (id, "userId", title, "businessName", location, bio, specializations, languages, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING * ',
      [
        profileId, 
        testUser.id, 
        'Test Pilot', 
        'Test Biz Name',
        'Test Location', 
        'This is a test profile for models', 
        '{Drone Photography,Mapping}', 
        '{English}', 
        new Date(), 
        new Date()
      ]
    );
    testProfile = profileInsertResult.rows[0];
    console.log(`Created Profile: ${testProfile.id} for User: ${testUser.id}`);
    const profileFindResult = await executeQuery('SELECT * FROM "Profile" WHERE id = $1', [testProfile.id]);
    expect(profileFindResult.rows.length).toBe(1);
    expect(profileFindResult.rows[0].userId).toBe(testUser.id);
    console.log('Profile Read Verified.');
    // Update
    await executeQuery('UPDATE "Profile" SET bio = $1 WHERE id = $2', ['Updated test bio', testProfile.id]);
    const profileUpdateResult = await executeQuery('SELECT bio FROM "Profile" WHERE id = $1', [testProfile.id]);
    expect(profileUpdateResult.rows[0].bio).toBe('Updated test bio');
    console.log('Profile Update Verified.');
    // Delete test is handled in finally block
    
    // --- Test Category --- 
    console.log('\n--- Testing Category Model ---');
    const categoryId = generateTestId('category');
    const categoryInsertResult = await executeQuery(
      'INSERT INTO "Category" (id, "profileId", name, description, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6) RETURNING * ',
      [categoryId, testProfile.id, 'Test Category', 'Test Description', new Date(), new Date()]
    );
    testCategory = categoryInsertResult.rows[0];
    console.log(`Created Category: ${testCategory.id} for Profile: ${testProfile.id}`);
    const categoryFindResult = await executeQuery('SELECT * FROM "Category" WHERE id = $1', [testCategory.id]);
    expect(categoryFindResult.rows.length).toBe(1);
    expect(categoryFindResult.rows[0].profileId).toBe(testProfile.id);
    console.log('Category Read Verified.');
    // Delete test is handled in finally block
    
    // --- Test GalleryItem --- 
    console.log('\n--- Testing GalleryItem Model ---');
    const galleryItemId = generateTestId('gallery');
    const galleryInsertResult = await executeQuery(
      'INSERT INTO "GalleryItem" (id, "profileId", "categoryId", title, description, type, "imageUrl", featured, location, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING * ',
      [galleryItemId, testProfile.id, testCategory.id, 'Test Image', 'Test gallery desc', 'IMAGE', '/test.jpg', true, 'Test Location', new Date(), new Date()]
    );
    testGalleryItem = galleryInsertResult.rows[0];
    console.log(`Created GalleryItem: ${testGalleryItem.id} for Profile: ${testProfile.id}, Category: ${testCategory.id}`);
    const galleryFindResult = await executeQuery('SELECT * FROM "GalleryItem" WHERE id = $1', [testGalleryItem.id]);
    expect(galleryFindResult.rows.length).toBe(1);
    expect(galleryFindResult.rows[0].categoryId).toBe(testCategory.id);
    console.log('GalleryItem Read Verified.');
    // Delete test is handled in finally block
    
    // --- Test Experience --- 
    console.log('\n--- Testing Experience Model ---');
    const experienceId = generateTestId('exp');
    const experienceInsertResult = await executeQuery(
      'INSERT INTO "Experience" (id, "profileId", title, company, location, "startDate", description, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING * ',
      [experienceId, testProfile.id, 'Test Job', 'Test Company', 'Test City', new Date('2023-01-15'), 'Did test things', new Date(), new Date()]
    );
    testExperience = experienceInsertResult.rows[0];
    console.log(`Created Experience: ${testExperience.id} for Profile: ${testProfile.id}`);
    const experienceFindResult = await executeQuery('SELECT * FROM "Experience" WHERE id = $1', [testExperience.id]);
    expect(experienceFindResult.rows.length).toBe(1);
    expect(experienceFindResult.rows[0].profileId).toBe(testProfile.id);
    console.log('Experience Read Verified.');
    // Delete test is handled in finally block
    
    // --- Test Equipment --- 
    console.log('\n--- Testing Equipment Model ---');
    const equipmentId = generateTestId('equip');
    const equipmentInsertResult = await executeQuery(
      'INSERT INTO "Equipment" (id, "profileId", name, type, description, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING * ',
      [equipmentId, testProfile.id, 'Test Drone', 'Drone', 'Flies high', new Date(), new Date()]
    );
    testEquipment = equipmentInsertResult.rows[0];
    console.log(`Created Equipment: ${testEquipment.id} for Profile: ${testProfile.id}`);
    const equipmentFindResult = await executeQuery('SELECT * FROM "Equipment" WHERE id = $1', [testEquipment.id]);
    expect(equipmentFindResult.rows.length).toBe(1);
    expect(equipmentFindResult.rows[0].profileId).toBe(testProfile.id);
    console.log('Equipment Read Verified.');
    // Delete test is handled in finally block
    
    // --- Test Certification --- 
    console.log('\n--- Testing Certification Model ---');
    const certificationId = generateTestId('cert');
    const certificationInsertResult = await executeQuery(
      'INSERT INTO "Certification" (id, "profileId", name, "issuingBody", "certificationId", "issueDate", "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING * ',
      [certificationId, testProfile.id, 'Test License', 'Test Authority', 'TEST12345', new Date('2024-01-01'), new Date(), new Date()]
    );
    testCertification = certificationInsertResult.rows[0];
    console.log(`Created Certification: ${testCertification.id} for Profile: ${testProfile.id}`);
    const certificationFindResult = await executeQuery('SELECT * FROM "Certification" WHERE id = $1', [testCertification.id]);
    expect(certificationFindResult.rows.length).toBe(1);
    expect(certificationFindResult.rows[0].profileId).toBe(testProfile.id);
    console.log('Certification Read Verified.');
    // Delete test is handled in finally block
    
    // Query user with profile
    console.log('\n--- Querying User with Profile ---');
    const userWithProfileResult = await executeQuery(
      `SELECT u.*, p.*
       FROM "User" u
       LEFT JOIN "Profile" p ON u.id = p."userId"
       WHERE u.id = $1`,
      [testUser.id]
    );
    
    if (userWithProfileResult.rows.length > 0) {
      const userWithProfile = userWithProfileResult.rows[0];
      console.log('User:', userWithProfile.name);
      console.log('Profile location:', userWithProfile.location);
      console.log('Specializations:', userWithProfile.specializations);
    }
    
    // Test querying other models
    console.log('\n--- Testing Other Models ---');
    
    try {
      const experienceCountResult = await executeQuery('SELECT COUNT(*) FROM "Experience"');
      console.log(`Experience count: ${experienceCountResult.rows[0].count}`);
    } catch (e) {
      console.log('Experience model not available or error:', e.message);
    }
    
    try {
      const equipmentCountResult = await executeQuery('SELECT COUNT(*) FROM "Equipment"');
      console.log(`Equipment count: ${equipmentCountResult.rows[0].count}`);
    } catch (e) {
      console.log('Equipment model not available or error:', e.message);
    }
    
    try {
      const certificationCountResult = await executeQuery('SELECT COUNT(*) FROM "Certification"');
      console.log(`Certification count: ${certificationCountResult.rows[0].count}`);
    } catch (e) {
      console.log('Certification model not available or error:', e.message);
    }
    
    try {
      const galleryItemCountResult = await executeQuery('SELECT COUNT(*) FROM "GalleryItem"');
      console.log(`Gallery item count: ${galleryItemCountResult.rows[0].count}`);
    } catch (e) {
      console.log('GalleryItem model not available or error:', e.message);
    }
    
    console.log('\n--- Re-checking Counts ---');
    const expCount = await executeQuery('SELECT COUNT(*) FROM "Experience" WHERE "profileId" = $1', [testProfile.id]);
    console.log(`Experience count for test profile: ${expCount.rows[0].count}`);
    expect(Number(expCount.rows[0].count)).toBeGreaterThan(0);
    
    const catCount = await executeQuery('SELECT COUNT(*) FROM "Category" WHERE "profileId" = $1', [testProfile.id]);
    console.log(`Category count for test profile: ${catCount.rows[0].count}`);
    expect(Number(catCount.rows[0].count)).toBeGreaterThan(0);
    
    const equipCount = await executeQuery('SELECT COUNT(*) FROM "Equipment" WHERE "profileId" = $1', [testProfile.id]);
    console.log(`Equipment count for test profile: ${equipCount.rows[0].count}`);
    expect(Number(equipCount.rows[0].count)).toBeGreaterThan(0);
    
    const certCount = await executeQuery('SELECT COUNT(*) FROM "Certification" WHERE "profileId" = $1', [testProfile.id]);
    console.log(`Certification count for test profile: ${certCount.rows[0].count}`);
    expect(Number(certCount.rows[0].count)).toBeGreaterThan(0);
    
    const galleryCount = await executeQuery('SELECT COUNT(*) FROM "GalleryItem" WHERE "profileId" = $1', [testProfile.id]);
    console.log(`GalleryItem count for test profile: ${galleryCount.rows[0].count}`);
    expect(Number(galleryCount.rows[0].count)).toBeGreaterThan(0);

    console.log('\n✅ All database model tests completed successfully!');
  } catch (error) {
    console.error('❌ Error testing models:', error);
    console.error(error.stack);
    // Ensure cleanup happens even on error before exiting
    throw error; // Re-throw error to ensure script exits with non-zero code if needed
  } finally {
    // Clear the timeout since we're finishing
    clearTimeout(timeoutId);
    
    // --- Cleanup Test Data --- 
    console.log('\n--- Cleaning up test data created during run ---');
    try {
       // Delete in reverse order of creation / dependency
      if (testGalleryItem) await executeQuery('DELETE FROM "GalleryItem" WHERE id = $1', [testGalleryItem.id]);
      if (testCategory) await executeQuery('DELETE FROM "Category" WHERE id = $1', [testCategory.id]);
      if (testExperience) await executeQuery('DELETE FROM "Experience" WHERE id = $1', [testExperience.id]);
      if (testEquipment) await executeQuery('DELETE FROM "Equipment" WHERE id = $1', [testEquipment.id]);
      if (testCertification) await executeQuery('DELETE FROM "Certification" WHERE id = $1', [testCertification.id]);
      if (testProfile) await executeQuery('DELETE FROM "Profile" WHERE id = $1', [testProfile.id]);
      if (testUser) await executeQuery('DELETE FROM "User" WHERE id = $1', [testUser.id]);
      console.log('Test data cleanup successful.');
    } catch (cleanupError) {
       console.error('Error during test data cleanup:', cleanupError);
    }
    
    // Close pool connection
    console.log('Closing database connection pool...');
    await pool.end();
    console.log('All database connections closed');
  }
}

// Simple assertion helper
const expect = (value) => ({
  toBe: (expected) => {
    if (value !== expected) throw new Error(`Assertion failed: Expected ${value} to be ${expected}`);
  },
  toEqual: (expected) => {
    // Basic deep comparison for objects/arrays in this context
    if (JSON.stringify(value) !== JSON.stringify(expected)) throw new Error(`Assertion failed: Expected ${JSON.stringify(value)} to equal ${JSON.stringify(expected)}`);
  },
  toBeGreaterThan: (expected) => {
     if (!(value > expected)) throw new Error(`Assertion failed: Expected ${value} to be greater than ${expected}`);
  }
});

// Execute main function with proper error handling
(async () => {
  try {
    await main();
  } catch (e) {
    console.error('Fatal error:', e);
    try {
      clearTimeout(timeoutId);
      await pool.end();
    } catch (error) {
      console.error('Error closing pool:', error);
    }
    process.exit(1);
  }
})(); 