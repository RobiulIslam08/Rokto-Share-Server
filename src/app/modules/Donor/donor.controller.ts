// // src/app/modules/Donor/donor.controller.ts
// import { Request, Response } from 'express';
// import catchAsync from '../../utils/catchAsync';
// import sendResponse from '../../utils/sendResponse';
// import httpStatus from 'http-status';
// import { DonorServices } from './donor.service';

// const getAllDonors = catchAsync(async (req: Request, res: Response) => {
//   const result = await DonorServices.getAllDonorsFromDB(req.query);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Donors retrieved successfully',
//     meta: result.meta,
//     data: result.data,
//   });
// });

// const getSingleDonor = catchAsync(async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const result = await DonorServices.getSingleDonorFromDB(id);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Donor retrieved successfully',
//     data: result,
//   });
// });

// export const DonorControllers = {
//   getAllDonors,
//   getSingleDonor,
// };