import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    const result = await db.select({ version: sql`version()` });
    const version = Array.isArray(result) ? result[0]?.version : 'Unknown';
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      postgresVersion: version,
      message: 'Database is ready'
    });
  } catch (error: any) {
    console.error('Database health check failed:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        database: 'disconnected',
        error: error.message,
        message: 'Database connection failed. Check environment variables.'
      },
      { status: 500 }
    );
  }
}
