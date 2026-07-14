import { Router } from 'express';

import {
  exportRegistrations,
  getAdminApplicationById,
  getAdminApplications,
  updateAdminApplication,
} from '../controllers/admin.controller';

export const adminRouter = Router();

/**
 * Candidate list, filters, statistics and pagination.
 */
adminRouter.get(
  '/applications',
  getAdminApplications,
);

/**
 * Excel export.
 *
 * This route must stay above the /:id route.
 */
adminRouter.get(
  '/applications/export',
  exportRegistrations,
);

/**
 * Complete details for one candidate.
 */
adminRouter.get(
  '/applications/:id',
  getAdminApplicationById,
);

/**
 * Update application status and private notes.
 */
adminRouter.patch(
  '/applications/:id',
  updateAdminApplication,
);