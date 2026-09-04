// @ts-ignore
import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

/**
 * Full Database Clone / Restore Script
 * This script imports the complete database backup (including auth, public, and storage schemas)
 * into the target Supabase database.
 */

// Function to construct Postgres URI from individual Supabase parts if a direct URI isn't provided.
function getConnectionString(): string {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  // For local Supabase
  return 'postgresql://postgres:postgres@127.0.0.1:54522/postgres';
}

async function restoreDatabase() {
  const connectionString = getConnectionString();
  console.log(`Connecting to database at ${connectionString.split('@')[1] || 'local'}...`);

  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log('✅ Connected to the database.');

    const dumpPath = path.join(process.cwd(), 'supabase', 'full_data_dump.sql');
    
    if (!fs.existsSync(dumpPath)) {
      throw new Error(`Backup file not found at ${dumpPath}`);
    }

    console.log(`Loading backup from ${dumpPath}...`);
    const sqlDump = fs.readFileSync(dumpPath, 'utf8');

    console.log('Executing database seed script (this may take a few moments)...');
    
    // Begin transaction for safety
    await client.query('BEGIN');

    // Disable triggers temporarily to prevent foreign key conflicts during bulk insert
    await client.query('SET session_replication_role = replica;');

    // Execute the full SQL dump
    await client.query(sqlDump);

    // Re-enable triggers
    await client.query('SET session_replication_role = DEFAULT;');

    await client.query('COMMIT');
    
    console.log('🎉 Successfully cloned all data (auth, public schemas, and storage metadata)!');

  } catch (err: any) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('❌ Error restoring the database:', err.message);
  } finally {
    await client.end();
  }
}

restoreDatabase();
