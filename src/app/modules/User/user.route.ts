import { Router } from "express";
import { UserControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidations } from "./user.validaiton";

const router = Router()
router.get('/profile',auth('admin', 'donor', 'user'), UserControllers.getUserProfile)
router.put(
  '/profile',
 auth('admin', 'donor', 'user'), // All roles can update their profile
  validateRequest(UserValidations.updateProfileValidationSchema), // Zod validation
  UserControllers.updateUserProfile,
);
export const UserRoutes = router;