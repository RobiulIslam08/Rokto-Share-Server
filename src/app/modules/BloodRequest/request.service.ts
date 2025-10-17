// src/app/modules/BloodRequest/request.service.ts
import { BloodRequest, IBloodRequest } from './request.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { UserProfile } from '../User/user.model';
import { User } from '../Auth/auth.model';

const createBloodRequestIntoDB = async (
  userId: string,
  payload: any
) => {


  // ১. Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  // ২. Check if user has profile (requester এর profile)
  const userProfile = await UserProfile.findOne({ user: userId });
  if (!userProfile) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'User profile not found! Please complete your profile first.'
    );
  }

  // ৩. Check if donor profile exists
  const donorProfile = await UserProfile.findById(payload.donorId);
  if (!donorProfile) {
    throw new AppError(httpStatus.NOT_FOUND, 'Donor profile not found!');
  }

  // ৪. Check if donor is available
  if (!donorProfile.isAvailable) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'This donor is currently unavailable!'
    );
  }

  // ৫. Generate unique requestId
  const count = await BloodRequest.countDocuments();
  const requestId = `REQ-${String(count + 1).padStart(6, '0')}`;

  // ৬. Create blood request
  const bloodRequestData = {
    requestId: requestId,
    userId: userId,
    donorId: payload.donorId,
    patientName: payload.patientName,
    patientAge: Number(payload.patientAge),
    hospital: payload.hospital,
    hospitalAddress: payload.hospitalAddress,
    unitsNeeded: Number(payload.unitsNeeded),
    urgency: payload.urgency,
    neededDate: new Date(payload.neededDate),
    neededTime: payload.neededTime,
    contactPhone: payload.contactPhone,
    medicalCondition: payload.medicalCondition,
    additionalNotes: payload.additionalNotes || '',
    status: 'Pending',
  };

  console.log('Blood request data to save:', bloodRequestData);

  // ৭. Save to database
  const bloodRequest = await BloodRequest.create(bloodRequestData);

  // ৮. Populate এবং return
  const populatedRequest = await BloodRequest.findById(bloodRequest._id)
    .populate('userId', 'name email phone')
    .populate({
      path: 'donorId',
      populate: {
        path: 'user',
        select: 'name email phone',
      },
    });

  return populatedRequest;
};

const getAllBloodRequestsFromDB = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter: Record<string, any> = {};

  if (query.status) {
    filter.status = query.status;
  }

  if (query.urgency) {
    filter.urgency = query.urgency;
  }

  if (query.userId) {
    filter.userId = query.userId;
  }

  if (query.donorId) {
    filter.donorId = query.donorId;
  }

  const total = await BloodRequest.countDocuments(filter);
  const totalPage = Math.ceil(total / limit);

  const result = await BloodRequest.find(filter)
    .populate('userId', 'name email phone')
    .populate({
      path: 'donorId',
      populate: {
        path: 'user',
        select: 'name email phone',
      },
    })
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: result,
  };
};

// ✅ Get current user's blood requests (যে requests এই user করেছে)
const getMyBloodRequestsFromDB = async (
  userId: string,
  query: Record<string, unknown>
) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter: Record<string, any> = {
    userId: userId, // শুধুমাত্র এই user এর requests
  };

  if (query.status) {
    filter.status = query.status;
  }

  if (query.urgency) {
    filter.urgency = query.urgency;
  }

  const total = await BloodRequest.countDocuments(filter);
  const totalPage = Math.ceil(total / limit);

  const result = await BloodRequest.find(filter)
    .populate('userId', 'name email phone')
    .populate({
      path: 'donorId',
      populate: {
        path: 'user',
        select: 'name email phone',
      },
    })
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: result,
  };
};

// ✅ Get requests for donor (যে requests এই donor এর কাছে এসেছে)
const getRequestsForDonorFromDB = async (
  userId: string,
  query: Record<string, unknown>
) => {
  // প্রথমে এই user এর profile খুঁজে বের করুন
  const userProfile = await UserProfile.findOne({ user: userId });
  
  if (!userProfile) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'User profile not found!'
    );
  }

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter: Record<string, any> = {
    donorId: userProfile._id, // এই donor এর কাছে যে requests এসেছে
  };

  if (query.status) {
    filter.status = query.status;
  }

  if (query.urgency) {
    filter.urgency = query.urgency;
  }

  const total = await BloodRequest.countDocuments(filter);
  const totalPage = Math.ceil(total / limit);

  const result = await BloodRequest.find(filter)
    .populate('userId', 'name email phone')
    .populate({
      path: 'donorId',
      populate: {
        path: 'user',
        select: 'name email phone',
      },
    })
    .sort('-createdAt')
    .skip(skip)
    .limit(limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: result,
  };
};

const getSingleBloodRequestFromDB = async (id: string) => {
  const result = await BloodRequest.findById(id)
    .populate('userId', 'name email phone')
    .populate({
      path: 'donorId',
      populate: {
        path: 'user',
        select: 'name email phone',
      },
    });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blood request not found!');
  }

  return result;
};

// ✅ Accept blood request
const acceptBloodRequestIntoDB = async (id: string, userId: string) => {
  const bloodRequest = await BloodRequest.findById(id);

  if (!bloodRequest) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blood request not found!');
  }

  // Check if user is the donor
  const userProfile = await UserProfile.findOne({ user: userId });
  
  if (!userProfile) {
    throw new AppError(httpStatus.NOT_FOUND, 'User profile not found!');
  }

  if (bloodRequest.donorId.toString() !== userProfile._id.toString()) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Only the donor can accept this request'
    );
  }

  if (bloodRequest.status !== 'Pending') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Only pending requests can be accepted'
    );
  }

  // Update status to Accepted
  const result = await BloodRequest.findByIdAndUpdate(
    id,
    { status: 'Accepted' },
    { new: true, runValidators: true }
  )
    .populate('userId', 'name email phone')
    .populate({
      path: 'donorId',
      populate: {
        path: 'user',
        select: 'name email phone',
      },
    });

  return result;
};

// ✅ Reject blood request
const rejectBloodRequestIntoDB = async (
  id: string,
  userId: string,
  rejectionReason: string
) => {
  const bloodRequest = await BloodRequest.findById(id);

  if (!bloodRequest) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blood request not found!');
  }

  // Check if user is the donor
  const userProfile = await UserProfile.findOne({ user: userId });
  
  if (!userProfile) {
    throw new AppError(httpStatus.NOT_FOUND, 'User profile not found!');
  }

  if (bloodRequest.donorId.toString() !== userProfile._id.toString()) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Only the donor can reject this request'
    );
  }

  if (bloodRequest.status !== 'Pending') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Only pending requests can be rejected'
    );
  }

  // Update status to Rejected
  const result = await BloodRequest.findByIdAndUpdate(
    id,
    { 
      status: 'Rejected',
      rejectionReason: rejectionReason || 'No reason provided'
    },
    { new: true, runValidators: true }
  )
    .populate('userId', 'name email phone')
    .populate({
      path: 'donorId',
      populate: {
        path: 'user',
        select: 'name email phone',
      },
    });

  return result;
};

// ✅ Complete blood request
const completeBloodRequestIntoDB = async (id: string, userId: string) => {
  const bloodRequest = await BloodRequest.findById(id);

  if (!bloodRequest) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blood request not found!');
  }

  // Check if user is the requester or donor
  const userProfile = await UserProfile.findOne({ user: userId });
  const isDonor = userProfile && bloodRequest.donorId.toString() === userProfile._id.toString();
  const isRequester = bloodRequest.userId.toString() === userId;

  if (!isRequester && !isDonor) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Only requester or donor can complete this request'
    );
  }

  if (bloodRequest.status !== 'Accepted') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Only accepted requests can be completed'
    );
  }

  // Update status to Completed
  const result = await BloodRequest.findByIdAndUpdate(
    id,
    { 
      status: 'Completed',
      completedAt: new Date()
    },
    { new: true, runValidators: true }
  )
    .populate('userId', 'name email phone')
    .populate({
      path: 'donorId',
      populate: {
        path: 'user',
        select: 'name email phone',
      },
    });

  return result;
};

// ✅ Cancel blood request
const cancelBloodRequestIntoDB = async (id: string, userId: string) => {
  const bloodRequest = await BloodRequest.findById(id);

  if (!bloodRequest) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blood request not found!');
  }

  // Only requester can cancel
  if (bloodRequest.userId.toString() !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Only the requester can cancel this request'
    );
  }

  if (bloodRequest.status === 'Completed') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Completed requests cannot be cancelled'
    );
  }

  // Update status to Cancelled
  const result = await BloodRequest.findByIdAndUpdate(
    id,
    { status: 'Cancelled' },
    { new: true, runValidators: true }
  )
    .populate('userId', 'name email phone')
    .populate({
      path: 'donorId',
      populate: {
        path: 'user',
        select: 'name email phone',
      },
    });

  return result;
};

const updateBloodRequestIntoDB = async (
  id: string,
  userId: string,
  payload: Partial<IBloodRequest>
) => {
  const bloodRequest = await BloodRequest.findById(id);

  if (!bloodRequest) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blood request not found!');
  }

  // Check if user is the requester or the donor
  const userProfile = await UserProfile.findOne({ user: userId });
  const isDonor = userProfile && bloodRequest.donorId.toString() === userProfile._id.toString();
  const isRequester = bloodRequest.userId.toString() === userId;

  if (!isRequester && !isDonor) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You do not have permission to update this request'
    );
  }

  // Update
  const result = await BloodRequest.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
    .populate('userId', 'name email phone')
    .populate({
      path: 'donorId',
      populate: {
        path: 'user',
        select: 'name email phone',
      },
    });

  return result;
};

const deleteBloodRequestFromDB = async (id: string, userId: string) => {
  const bloodRequest = await BloodRequest.findById(id);

  if (!bloodRequest) {
    throw new AppError(httpStatus.NOT_FOUND, 'Blood request not found!');
  }

  // Only requester can delete
  if (bloodRequest.userId.toString() !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You do not have permission to delete this request'
    );
  }

  await BloodRequest.findByIdAndDelete(id);
};

// ✅ Get donation history for the current donor
const getDonorDonationHistoryFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  // ১. ইউজার আইডি দিয়ে ডোনরের প্রোফাইল খুঁজে বের করা
  const userProfile = await UserProfile.findOne({ user: userId });
  if (!userProfile) {
    throw new AppError(httpStatus.NOT_FOUND, 'Donor profile not found!');
  }

  // ২. পেজিনেশন সেটআপ
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter: Record<string, any> = {
    donorId: userProfile._id,
  };

  // ✅ IMPROVEMENT: Robust status filtering
  // এখানে আমরা নিশ্চিত করছি যে শুধুমাত্র ভ্যালিড স্ট্যাটাস ফিল্টারে যোগ হবে
  const validStatuses = ['Pending', 'Accepted', 'Rejected', 'Completed', 'Cancelled'];
  const statusFromQuery = query.status as string;

  if (statusFromQuery && validStatuses.includes(statusFromQuery)) {
    filter.status = statusFromQuery;
  } else {
    // যদি কোনো ভ্যালিড স্ট্যাটাস না পাঠানো হয়, ডিফল্ট হিসেবে 'Completed' ধরবে
    filter.status = 'Completed';
  }

  // ৩. ডেটাবেস থেকে ডেটা এবং মোট সংখ্যা বের করা
  const total = await BloodRequest.countDocuments(filter);
  const totalPage = Math.ceil(total / limit);

  const result = await BloodRequest.find(filter)
    .populate('userId', 'name email phone')
    .populate({
      path: 'donorId',
      select: 'bloodGroup user', // Select bloodGroup and the user ref
      populate: {
        path: 'user',
        select: 'name email', // Select donor's name and email
      },
    })
    .sort('-completedAt')
    .skip(skip)
    .limit(limit);

  // ৪. মেটা এবং ডেটা সহ রিটার্ন করা
  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    data: result,
  };
};
export const BloodRequestServices = {
  createBloodRequestIntoDB,
  getAllBloodRequestsFromDB,
  getMyBloodRequestsFromDB,
  getRequestsForDonorFromDB,
  getSingleBloodRequestFromDB,
  acceptBloodRequestIntoDB,
  rejectBloodRequestIntoDB,
  completeBloodRequestIntoDB,
  cancelBloodRequestIntoDB,
  updateBloodRequestIntoDB,
  deleteBloodRequestFromDB,
  getDonorDonationHistoryFromDB
};