import { Router } from 'express';
import {
  getFormConfigs,
  getFormConfigById,
  getFormConfigByCategory,
  createFormConfig,
  updateFormConfig,
  deleteFormConfig,
  exportRegistrations
} from '../controllers/admin.controller';

export const adminRouter = Router();

/**
 * CRUD routes for form configurations
 */
adminRouter.get('/form-config', getFormConfigs);
adminRouter.get('/form-config/category/:categoryName', getFormConfigByCategory);
adminRouter.get('/form-config/:id', getFormConfigById);
adminRouter.post('/form-config', createFormConfig);
adminRouter.put('/form-config/:id', updateFormConfig);
adminRouter.delete('/form-config/:id', deleteFormConfig);

/**
 * Excel export route for registrations
 */
adminRouter.get('/export-registrations', exportRegistrations);
