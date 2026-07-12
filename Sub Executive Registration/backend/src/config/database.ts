import { Pool, type PoolClient, type QueryResultRow } from 'pg';
import { env } from './env';

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: env.NODE_ENV === 'production' ? 10 : 5,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
});

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error:', error);
});

export async function testDatabaseConnection(): Promise<{
  database: string;
  serverTime: string;
}> {
  const result = await pool.query<{
    database: string;
    server_time: Date;
  }>('SELECT current_database() AS database, NOW() AS server_time');

  const row = result.rows[0];
  if (!row) {
    throw new Error('Database connection test returned no result.');
  }

  return {
    database: row.database,
    serverTime: row.server_time.toISOString(),
  };
}

export async function withTransaction<T>(
  callback: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function queryOne<T extends QueryResultRow>(
  sql: string,
  values: unknown[] = [],
): Promise<T | null> {
  const result = await pool.query<T>(sql, values);
  return result.rows[0] ?? null;
}
