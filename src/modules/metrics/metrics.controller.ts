import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendResponse } from '../../utils/sendResponse';
import { getSystemMetrics } from './metrics.service';

export const getMetricsController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const metrics = await getSystemMetrics();
  sendResponse(res, StatusCodes.OK, {
    success: true,
    data: metrics,
  });
});
