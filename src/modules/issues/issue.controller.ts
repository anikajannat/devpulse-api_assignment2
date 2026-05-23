import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendResponse } from '../../utils/sendResponse';
import { AppError } from '../../utils/AppError';
import { createIssue, deleteIssue, getAllIssues, getIssueById, updateIssue, updateIssueStatus } from './issue.service';

const parseId = (id: string): number => {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid issue id');
  }
  return numericId;
};

export const createIssueController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) throw new AppError(StatusCodes.UNAUTHORIZED, 'Authentication required');

  const issue = await createIssue(req.body, req.user.id);
  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: 'Issue created successfully',
    data: issue,
  });
});

export const getIssuesController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const issues = await getAllIssues({
    sort: req.query.sort as string | undefined,
    type: req.query.type as string | undefined,
    status: req.query.status as string | undefined,
  });

  sendResponse(res, StatusCodes.OK, {
    success: true,
    data: issues,
  });
});

export const getSingleIssueController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const issue = await getIssueById(parseId(req.params.id));
  sendResponse(res, StatusCodes.OK, {
    success: true,
    data: issue,
  });
});

export const updateIssueController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.user) throw new AppError(StatusCodes.UNAUTHORIZED, 'Authentication required');

  const issue = await updateIssue(parseId(req.params.id), req.body, req.user.id, req.user.role);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Issue updated successfully',
    data: issue,
  });
});

export const updateIssueStatusController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const issue = await updateIssueStatus(parseId(req.params.id), req.body.status);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Issue status updated successfully',
    data: issue,
  });
});

export const deleteIssueController = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  await deleteIssue(parseId(req.params.id));
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Issue deleted successfully',
  });
});
