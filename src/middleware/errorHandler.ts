import { ErrorRequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/AppError';

export const notFoundHandler = (): never => {
  throw new AppError(StatusCodes.NOT_FOUND, 'Route not found');
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const statusCode = err instanceof AppError ? err.statusCode : StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err instanceof AppError ? err.message : 'Internal Server Error';
  const errors = err instanceof AppError ? err.errors : undefined;

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
