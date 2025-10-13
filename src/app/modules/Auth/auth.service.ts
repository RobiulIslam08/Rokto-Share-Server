import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TUser } from './auth.interface';
import { User } from './auth.model';
import config from '../../config';
import { createToken, verifyToken } from './auth.utils';
import mongoose from 'mongoose';
import { UserProfile } from '../User/user.model';

const loginUser = async (payload: Pick<TUser, 'email' | 'password'>) => {
  const user = await User.findOne({ email: payload?.email }).select(
    '+password',
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
  }

  const isPasswordMatched = await User.isPasswordMatched(
    payload.password as string,
    user.password as string,
  );

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password does not match!');
  }

  const jwtPayload = {
    userId: user?.id, // 
    role: user?.role,
  };

  // ✅ Access Token এবং Refresh Token দুটোই তৈরি কর
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  const loggedInUser = await User.findOne({ email: payload.email });

  return {
    accessToken,
    refreshToken,
    user: loggedInUser,
  };
};

const registerDonorIntoDB = async (payload: Record<string, any>) => {
  const userExists = await User.findOne({ email: payload.email });
  if (userExists) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This email is already used!');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const userData: Partial<TUser> = {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      phone: payload.phone,
      role: 'donor',
    };

    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    const userProfileData = {
      user: newUser[0]._id,
      bloodGroup: payload.bloodGroup,
      age: payload.age,
      weight: payload.weight,
      location: {
        division: payload.division,
        district: payload.district,
        upazila: payload.upazila,
      },
      isAvailable: true,
      lastDonationDate: payload.lastDonation,
      medicalHistory: payload.medicalHistory,
      previousDonations: payload.previousDonations ?? 0,
    };

    await UserProfile.create([userProfileData], { session });

    await session.commitTransaction();
    session.endSession();

    const result = await User.findById(newUser[0]._id).lean();
    
    // ✅ Token তৈরি করুন (login এর মতো)
    const jwtPayload = {
      userId: newUser[0]._id.toString(),
      role: 'donor',
    };

    // ✅ Access Token এবং Refresh Token দুটোই তৈরি করলাম
    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string,
    );

    // ✅ User এবং Token দুটোই return করুন
    return {
      accessToken,
      refreshToken,
      user: result,
    };

  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Failed to register donor: ${err.message}`,
    );
  }
};

const refreshAccessToken = async (refreshToken: string) => {
  // Verify refresh token
  const decoded = verifyToken(refreshToken, config.jwt_refresh_secret as string);

  const { userId } = decoded;

  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // Create new access token
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const newAccessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken: newAccessToken,
  };
};
export const AuthServices = {
  loginUser,
  registerDonorIntoDB,
  refreshAccessToken
};