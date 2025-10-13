import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidations } from './auth.validation';
import { AuthControllers } from './auth.controller';
const router = express.Router();
router.post(
  '/register-donor',
  validateRequest(AuthValidations.registerDonorValidationSchema),
  AuthControllers.registerDonor,
);

router.post(
  '/login',
  validateRequest(AuthValidations.loginUserValidationSchema),
  AuthControllers.loginUser,
);


router.post('/refresh-token', AuthControllers.refreshToken);


router.post('/logout', AuthControllers.logout);
export const AuthRoutes = router;