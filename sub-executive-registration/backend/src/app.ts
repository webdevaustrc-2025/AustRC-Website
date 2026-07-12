import cors, { type CorsOptions } from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from './config/env';
import {
  errorHandler,
  notFoundHandler,
} from './middleware/errorHandler';
import { registrationRouter } from './routes/registrationRoutes';

/**
 * Main Express application.
 *
 * This file does not call app.listen().
 * Therefore, Vercel can import and run the Express application as a function.
 *
 * Local server startup is handled separately by server.ts.
 */
const app = express();

/**
 * Remove the default Express response header.
 */
app.disable('x-powered-by');

/**
 * Required when the application runs behind Vercel or another reverse proxy.
 *
 * This also helps express-rate-limit identify the correct client IP address.
 */
app.set('trust proxy', 1);

/**
 * Normalize configured frontend origins by removing trailing slashes.
 */
const allowedFrontendOrigins = env.frontendUrls.map((origin) =>
  origin.trim().replace(/\/$/, ''),
);

/**
 * CORS configuration.
 *
 * Requests without an Origin header are allowed because they may come from:
 * - direct browser navigation
 * - Postman
 * - curl
 * - server-to-server requests
 * - Vercel health checks
 */
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    const normalizedOrigin = origin.replace(/\/$/, '');

    if (allowedFrontendOrigins.includes(normalizedOrigin)) {
      callback(null, true);
      return;
    }

    callback(
      new Error(
        `Origin "${origin}" is not allowed to access this API.`,
      ),
    );
  },

  methods: ['GET', 'POST', 'OPTIONS'],

  allowedHeaders: [
    'Content-Type',
    'Accept',
  ],

  credentials: false,

  optionsSuccessStatus: 204,
};

/**
 * Security middleware.
 */
app.use(helmet());

/**
 * Cross-origin request handling.
 */
app.use(cors(corsOptions));

/**
 * Parse JSON request bodies.
 */
app.use(
  express.json({
    limit: '100kb',
  }),
);

/**
 * Parse URL-encoded request bodies.
 */
app.use(
  express.urlencoded({
    extended: false,
    limit: '100kb',
  }),
);

/**
 * HTTP request logging.
 */
app.use(
  morgan(
    env.NODE_ENV === 'production'
      ? 'combined'
      : 'dev',
  ),
);

/**
 * Basic root endpoint.
 *
 * Opening the backend domain directly will show that the API is online.
 */
app.get('/', (_request, response) => {
  response.status(200).json({
    success: true,
    data: {
      service: 'AUSTRC Sub-Executive Registration API',
      status: 'online',
      healthEndpoint: '/api/health',
    },
  });
});

/**
 * General API rate limiter.
 *
 * Maximum:
 * 300 API requests from one IP address within 15 minutes.
 */
const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,

  standardHeaders: 'draft-8',
  legacyHeaders: false,

  message: {
    success: false,
    error: {
      code: 'TOO_MANY_REQUESTS',
      message:
        'Too many requests were received. Please try again later.',
    },
  },
});

/**
 * Registration submission rate limiter.
 *
 * Maximum:
 * 20 registration submissions from one IP address within one hour.
 */
const applicationSubmissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 20,

  standardHeaders: 'draft-8',
  legacyHeaders: false,

  message: {
    success: false,
    error: {
      code: 'APPLICATION_RATE_LIMIT',
      message:
        'Too many application attempts were received. Please try again later.',
    },
  },
});

/**
 * Apply the general limiter to every API endpoint.
 */
app.use('/api', generalApiLimiter);

/**
 * Apply the stricter limiter only to POST application submissions.
 *
 * It will not unnecessarily restrict the application-status GET endpoint.
 */
app.post(
  '/api/applications',
  applicationSubmissionLimiter,
);

/**
 * Mount all registration API routes.
 */
app.use('/api', registrationRouter);

/**
 * Handle requests that do not match any existing route.
 */
app.use(notFoundHandler);

/**
 * Central error handler.
 *
 * This must remain the final middleware.
 */
app.use(errorHandler);

/**
 * Named export keeps compatibility with code that imports:
 *
 * import { app } from './app';
 */
export { app };

/**
 * Default export is required for clean Vercel Express detection.
 */
export default app;