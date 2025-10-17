import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await UserServices.getUserProfileDataFromDB(userId as string)
  sendResponse(res, {
	  statusCode: httpStatus.OK,
    success: true,
    message: 'User profile retrieved successfully',
    data: result,
  })

});
export const UserControllers = {
  getUserProfile,
};
