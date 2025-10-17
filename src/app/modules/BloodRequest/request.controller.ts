// src/app/modules/BloodRequest/request.controller.ts
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { BloodRequestServices } from './request.service';
import AppError from '../../errors/AppError';

const createBloodRequest = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const result = await BloodRequestServices.createBloodRequestIntoDB(
    userId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Blood request created successfully',
    data: result,
  });
});

const getAllBloodRequests = catchAsync(async (req: Request, res: Response) => {
  const result = await BloodRequestServices.getAllBloodRequestsFromDB(
    req.query
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blood requests retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});




// ✅ Get current user's blood requests
const getMyBloodRequests = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const result = await BloodRequestServices.getMyBloodRequestsFromDB(
    userId,
    req.query
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My blood requests retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});


// ✅ Get requests for donor
const getRequestsForDonor = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const result = await BloodRequestServices.getRequestsForDonorFromDB(
    userId,
    req.query
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Donor requests retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getSingleBloodRequest = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await BloodRequestServices.getSingleBloodRequestFromDB(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Blood request retrieved successfully',
      data: result,
    });
  }
);

// ✅ Accept blood request
const acceptBloodRequest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const result = await BloodRequestServices.acceptBloodRequestIntoDB(
    id,
    userId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blood request accepted successfully',
    data: result,
  });
});

// ✅ Reject blood request
const rejectBloodRequest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;
  const { rejectionReason } = req.body;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const result = await BloodRequestServices.rejectBloodRequestIntoDB(
    id,
    userId,
    rejectionReason
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blood request rejected',
    data: result,
  });
});

// ✅ Complete blood request
const completeBloodRequest = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
    }

    const result = await BloodRequestServices.completeBloodRequestIntoDB(
      id,
      userId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Blood request completed successfully',
      data: result,
    });
  }
);

// ✅ Cancel blood request
const cancelBloodRequest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const result = await BloodRequestServices.cancelBloodRequestIntoDB(
    id,
    userId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blood request cancelled',
    data: result,
  });
});

const updateBloodRequest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const result = await BloodRequestServices.updateBloodRequestIntoDB(
    id,
    userId,
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blood request updated successfully',
    data: result,
  });
});

const deleteBloodRequest = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  await BloodRequestServices.deleteBloodRequestFromDB(id, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blood request deleted successfully',
    data: null,
  });
});

const getDonorDonationHistory = catchAsync(async (req: Request, res: Response) => {
  // auth middleware থেকে user id নেওয়া হচ্ছে
  const userId = req.user?.userId as string; 

  const result = await BloodRequestServices.getDonorDonationHistoryFromDB(
    userId,
    req.query,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Donation history retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const BloodRequestControllers = {
  createBloodRequest,
  getAllBloodRequests,
  getMyBloodRequests,
  getRequestsForDonor,
  getSingleBloodRequest,
  acceptBloodRequest,
  rejectBloodRequest,
  completeBloodRequest,
  cancelBloodRequest,
  updateBloodRequest,
  deleteBloodRequest,
  getDonorDonationHistory
};