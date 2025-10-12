import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { AuthServices } from './auth.service';
const registerDonor = catchAsync(async (req, res) => {
  const result = await AuthServices.registerDonorIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Donor registered successfully',
    data: result,
  });
});
const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: result,
  });
});

export const AuthControllers = {
  registerDonor,
  loginUser,
};