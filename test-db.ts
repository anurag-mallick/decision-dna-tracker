import { neon } from '@neondatabase/serverless';

const sql = neon('postgres://neondb_owner:napi_yccep969ruv0h2knhwk93fi4ojb409bp2o9szw7pls1u5a9klth5lbjop55izsbn@ep-floral-violet-47241531.us-east-2.aws.neon.tech/neondb?sslmode=require');

async function test() {
  try {
    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log('Tables:', tables);
    
    const users = await sql`SELECT COUNT(*) FROM users`;
    console.log('Users count:', users);
  } catch (e: any) {
    console.error('Error:', e.message);
  }
}

test();
