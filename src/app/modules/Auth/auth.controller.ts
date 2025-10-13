import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { AuthServices } from './auth.service';
import config from '../../config';

const registerDonor = catchAsync(async (req, res) => {
  const result = await AuthServices.registerDonorIntoDB(req.body);

  const { refreshToken, accessToken, user } = result;

  // ✅ Refresh Token কে httpOnly cookie হিসেবে সেট করুন
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production', // শুধু production এ secure হবে
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 দিন
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Donor registered successfully',
    data: {
      user,
      accessToken,
    },
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);

  const { refreshToken, accessToken, user } = result;

  // ✅ Refresh Token কে httpOnly cookie হিসেবে সেট করুন
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 দিন
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: {
      user,
      accessToken,
    },
  });
});

// ✅ নতুন: Refresh Token Route
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await AuthServices.refreshAccessToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token refreshed successfully',
    data: result,
  });
});

// ✅ নতুন: Logout Route
const logout = catchAsync(async (req, res) => {
  // Cookie মুছে ফেলুন
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Logged out successfully',
    data: null,
  });
});

export const AuthControllers = {
  registerDonor,
  loginUser,
  refreshToken,
  logout,
};