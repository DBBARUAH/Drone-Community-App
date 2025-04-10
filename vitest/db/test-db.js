// Test database connection
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

// Initialize Prisma with pooler connection 
// (DATABASE_URL should be the pooler URL)
const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

// Add timeout to avoid hanging processes
setTimeout(() => {
  console.error('Test timeout after 30 seconds - terminating...');
  process.exit(1);
}, 30000);

async function main() {
  try {
    console.log('Testing database connection...');
    
    // Log environment variables status (without exposing values)
    console.log(`DATABASE_URL is ${process.env.DATABASE_URL ? 'set' : 'NOT SET!'}`);
    console.log(`DIRECT_URL is ${process.env.DIRECT_URL ? 'set' : 'NOT SET!'}`);
    
    // Test connection using Prisma
    console.log('\nTesting pooler connection with Prisma...');
    const queryResult = await prisma.$queryRaw`SELECT 1 as connected`;
    console.log('Prisma pooler connection test:', queryResult[0].connected === 1 ? 'SUCCESS' : 'FAILED');
    
    // Additional database info
    console.log('\nDatabase version:');
    const versionResult = await prisma.$queryRaw`SELECT version()`;
    console.log(versionResult[0].version);
    
    console.log('\nConnection info:');
    const connectionInfo = await prisma.$queryRaw`
      SELECT 
        current_database() as database,
        current_user as user,
        inet_server_addr() as server_addr,
        inet_server_port() as server_port
    `;
    console.log(`Database: ${connectionInfo[0].database}`);
    console.log(`User: ${connectionInfo[0].user}`);
    console.log(`Server: ${connectionInfo[0].server_addr}:${connectionInfo[0].server_port}`);
    
    // Test the direct connection if available
    if (process.env.DIRECT_URL) {
      console.log('\nDirect connection information is available but not tested in this script.');
      console.log('The pooler connection is preferred for normal operations.');
    }
    
    console.log('\n✅ Database connection test completed successfully!');
  } catch (error) {
    console.error('\n❌ Error connecting to database:');
    console.error(error);
    
    // Provide helpful debugging information
    console.error('\nPossible issues:');
    console.error('- Database server is not reachable');
    console.error('- IP address is not allowed in server firewall or security groups');
    console.error('- DATABASE_URL environment variable is not set or incorrect');
    console.error('- Database credentials are invalid');
    console.error('- Connection string format is incorrect');
    
    process.exit(1);
  } finally {
    // Ensure the Prisma client is properly disconnected
    await prisma.$disconnect();
  }
}

// Execute with proper error handling
(async () => {
  try {
    await main();
  } catch (e) {
    console.error('Fatal error:', e);
    process.exit(1);
  } finally {
    try {
      await prisma.$disconnect();
    } catch (e) {
      console.error('Error during final disconnect:', e);
    }
  }
})(); 