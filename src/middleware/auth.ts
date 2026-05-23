import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { env } from '../config/env';
import { JwtPayloadData, UserRole } from '../types';
import { AppError } from '../utils/AppError';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  const token = authHeader?.split(' ')[1];

  if (!token) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Authorization token is required');
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as JwtPayloadData;

    req.user = {
      id: decoded.id,
      name: decoded.name,
      role: decoded.role,
    };

    next();
  } catch {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid or expired token');
  }
};

export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError(StatusCodes.UNAUTHORIZED, 'Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(StatusCodes.FORBIDDEN, 'You do not have permission to perform this action');
    }

    next();
  };
};
