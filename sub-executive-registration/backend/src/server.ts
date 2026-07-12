import type { Server } from 'node:http';

import app from './app';
import {
  pool,
  testDatabaseConnection,
} from './config/database';
import { env } from './config/env';

/**
 * The locally running HTTP server.
 *
 * Vercel does not use this variable because Vercel imports
 * the Express application directly.
 */
let server: Server | null = null;

/**
 * Prevent the shutdown process from running more than once.
 */
let isShuttingDown = false;

/**
 * Start the local Node.js server.
 *
 * This function is used only during local development or when the
 * backend runs on a traditional Node.js server.
 */
async function startServer(): Promise<void> {
  try {
    const databaseInfo =
      await testDatabaseConnection();

    console.log(
      `Connected to Neon database "${databaseInfo.database}" at ${databaseInfo.serverTime}.`,
    );

    server = app.listen(env.PORT, () => {
      console.log(
        `AUSTRC registration API running on http://localhost:${env.PORT}`,
      );

      console.log(
        `Health check: http://localhost:${env.PORT}/api/health`,
      );
    });
  } catch (error: unknown) {
    console.error(
      'Could not start the API because the Neon database is unreachable:',
      error,
    );

    try {
      await pool.end();
    } catch (poolError: unknown) {
      console.error(
        'Could not close the PostgreSQL connection pool:',
        poolError,
      );
    }

    process.exit(1);
  }
}

/**
 * Gracefully close the HTTP server and PostgreSQL connection pool.
 */
async function shutdown(
  signal: string,
): Promise<void> {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  console.log(
    `${signal} received. Closing the API server...`,
  );

  /**
   * Force the process to stop if graceful shutdown takes too long.
   */
  const forceShutdownTimer = setTimeout(() => {
    console.error(
      'Graceful shutdown timed out. Forcing process termination.',
    );

    process.exit(1);
  }, 10_000);

  forceShutdownTimer.unref();

  try {
    if (server) {
      await new Promise<void>(
        (resolve, reject) => {
          server?.close((error) => {
            if (error) {
              reject(error);
              return;
            }

            resolve();
          });
        },
      );
    }

    await pool.end();

    clearTimeout(forceShutdownTimer);

    console.log(
      'HTTP server and Neon connection pool closed successfully.',
    );

    process.exit(0);
  } catch (error: unknown) {
    clearTimeout(forceShutdownTimer);

    console.error(
      'An error occurred during server shutdown:',
      error,
    );

    process.exit(1);
  }
}

/**
 * Start the HTTP listener only outside Vercel.
 *
 * Local environment:
 *   app.listen() runs on port 5000.
 *
 * Vercel environment:
 *   Vercel imports the default Express app export and manages the runtime.
 */
if (!process.env.VERCEL) {
  void startServer();

  process.once('SIGINT', () => {
    void shutdown('SIGINT');
  });

  process.once('SIGTERM', () => {
    void shutdown('SIGTERM');
  });
}

/**
 * This also makes server.ts safe if Vercel detects it as an entry file.
 */
export default app;