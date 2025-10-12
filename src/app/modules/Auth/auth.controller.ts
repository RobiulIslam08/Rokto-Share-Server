import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
const registerDonor = catchAsync(async (req, res) => {
  const result = await AuthServices.registerDonorIntoDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Donor registered successfully',
    data: result,
  });
});
const loginUser = ()=> {
	
}

export const AuthControllers = {
  registerDonor,
  loginUser,
};