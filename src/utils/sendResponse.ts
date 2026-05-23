import { Response } from 'express';

interface SuccessResponse<T> {
  success: true;
  message?: string;
  data?: T;
}

export const sendResponse = <T>(res: Response, statusCode: number, payload: SuccessResponse<T>): void => {
  res.status(statusCode).json(payload);
};
