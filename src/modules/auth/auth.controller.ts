import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendResponse } from '../../utils/sendResponse';
import { loginUser, signupUser } from './auth.service';

export const signup = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const user = await signupUser(req.body);
  sendResponse(res, StatusCodes.CREATED, {
    success: true,
    message: 'User registered successfully',
    data: user,
  });
});

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const result = await loginUser(req.body);
  sendResponse(res, StatusCodes.OK, {
    success: true,
    message: 'Login successful',
    data: result,
  });
});
