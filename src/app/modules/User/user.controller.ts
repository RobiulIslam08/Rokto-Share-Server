import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  
  const result = await UserServices.getUserProfileDataFromDB(userId as string)
  console.log('✅ User Profile Result:', result);
  sendResponse(res, {
	  statusCode: httpStatus.OK,
    success: true,
    message: 'User profile retrieved successfully',
    data: result,
  })

});
// ✅ NEW: Controller for updating the profile
const updateUserProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const payload = req.body;

  const result = await UserServices.updateUserProfileIntoDB(userId as string, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile updated successfully',
    data: result,
  });
});
export const UserControllers = {
  getUserProfile,
  updateUserProfile
};
