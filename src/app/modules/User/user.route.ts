import { Router } from "express";
import { UserControllers } from "./user.controller";

const router = Router()
router.get('/profile', UserControllers.getUserProfile)
export const UserRoutes = router;