import type { Request, Response } from 'express';
import { testDatabaseConnection } from '../config/database';
import {
  createApplication,
  getApplicationStatus,
  getFormOptions,
  getTeamQuestions,
} from '../services/registrationService';
import type { CreateApplicationInput } from '../types/registration';

export async function healthController(_request: Request, response: Response) {
  const databaseInfo = await testDatabaseConnection();

  response.json({
    success: true,
    data: {
      service: 'AUSTRC Sub-Executive Registration API',
      status: 'online',
      database: 'connected',
      databaseName: databaseInfo.database,
      serverTime: databaseInfo.serverTime,
    },
  });
}

export async function formOptionsController(_request: Request, response: Response) {
  const options = await getFormOptions();
  response.json({ success: true, data: options });
}

export async function teamQuestionsController(request: Request, response: Response) {
  const result = await getTeamQuestions(request.params.teamId as string);
  response.json({ success: true, data: result });
}

export async function createApplicationController(
  request: Request<unknown, unknown, CreateApplicationInput>,
  response: Response,
) {
  const application = await createApplication(request.body);
  response.status(201).json({ success: true, data: application });
}

export async function applicationStatusController(
  request: Request,
  response: Response,
) {
  const result = await getApplicationStatus(
    request.params.applicationNumber as string,
    request.query.studentId as string,
  );

  response.json({ success: true, data: result });
}
