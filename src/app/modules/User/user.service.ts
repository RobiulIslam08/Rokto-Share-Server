import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { UserProfile } from './user.model';
import httpStatus from 'http-status';
import { User } from '../Auth/auth.model';
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
const updateUserProfileIntoDB = async (userId: string,payload: Record<string, any>) => {
  
  const {name,phone,age,weight,location,isAvailable,lastDonationDate,medicalHistory} = payload;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1. Prepare and update User model data
    const userDataToUpdate: Record<string, unknown> = {};
    if (name) userDataToUpdate.name = name;
    if (phone) userDataToUpdate.phone = phone;

    if (Object.keys(userDataToUpdate).length > 0) {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        userDataToUpdate,
        {
          new: true,
          session,
        },
      );
      if (!updatedUser) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update user');
      }
    }

    // 2. Prepare and update UserProfile model data
    const profileDataToUpdate: Record<string, unknown> = {};
    if (age) profileDataToUpdate.age = age;
    if (weight) profileDataToUpdate.weight = weight;
    if (isAvailable !== undefined) profileDataToUpdate.isAvailable = isAvailable;
    if (lastDonationDate)
      profileDataToUpdate.lastDonationDate = lastDonationDate;
    if (medicalHistory) profileDataToUpdate.medicalHistory = medicalHistory;

    // Safely update nested location object using dot notation
    if (location) {
      if (location.division)
        profileDataToUpdate['location.division'] = location.division;
      if (location.district)
        profileDataToUpdate['location.district'] = location.district;
      if (location.upazila)
        profileDataToUpdate['location.upazila'] = location.upazila;
    }

    if (Object.keys(profileDataToUpdate).length > 0) {
      const updatedProfile = await UserProfile.findOneAndUpdate(
        { user: userId },
        profileDataToUpdate,
        { new: true, session },
      );
      if (!updatedProfile) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Failed to update user profile',
        );
      }
    }

    // If all updates are successful, commit the transaction
    await session.commitTransaction();
    await session.endSession();

    // 3. Return the fully populated, updated profile
    // (This ensures the frontend gets the fresh, combined data)
    return await getUserProfileDataFromDB(userId);
  } catch (error) {
    // If any update fails, abort the transaction
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update profile. Please try again.',
    );
  }
};
export const UserServices = {
  getUserProfileDataFromDB,
  updateUserProfileIntoDB
};
