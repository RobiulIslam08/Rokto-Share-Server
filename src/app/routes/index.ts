import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { DonorRoutes } from "../modules/Donor/donor.route";
import { BloodRequestRoutes } from "../modules/BloodRequest/request.route";
import { UserRoutes } from "../modules/User/user.route";

const router = Router();

const moduleRoutes = [
{
    path: '/auth',
    route: AuthRoutes
  },
    {
    path: '/donors',
    route: DonorRoutes
  },
   {
    path: '/requests',
    route: BloodRequestRoutes,
  },
   {
    path: '/users',
    route: UserRoutes,
  },
]
moduleRoutes.forEach((route) => router.use(route.path, route.route))
export default router