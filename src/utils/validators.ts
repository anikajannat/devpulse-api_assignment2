import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError';
import { IssueStatus, IssueType, UserRole } from '../types';

export const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const validateRole = (role: string): UserRole => {
  if (role === 'contributor' || role === 'maintainer') return role;
  throw new AppError(StatusCodes.BAD_REQUEST, 'Role must be contributor or maintainer');
};

export const validateIssueType = (type: string): IssueType => {
  if (type === 'bug' || type === 'feature_request') return type;
  throw new AppError(StatusCodes.BAD_REQUEST, 'Type must be bug or feature_request');
};

export const validateIssueStatus = (status: string): IssueStatus => {
  if (status === 'open' || status === 'in_progress' || status === 'resolved') return status;
  throw new AppError(StatusCodes.BAD_REQUEST, 'Status must be open, in_progress, or resolved');
};
