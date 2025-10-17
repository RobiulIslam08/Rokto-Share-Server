import AppError from '../../errors/AppError';
import { UserProfile } from './user.model';
import httpStatus from 'http-status';
const getUserProfileDataFromDB = async (userId: string) => {
  const userProfile = await UserProfile.findOne({ user: userId }).populate({
    path: 'user',
    select: 'name email phone avatar',
  });
  if (!userProfile) {
    throw new AppError(httpStatus.NOT_FOUND, 'User profile not found!');
  }

  return userProfile;
};
export const UserServices = {
  getUserProfileDataFromDB,
};
