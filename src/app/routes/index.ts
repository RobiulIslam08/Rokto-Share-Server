import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { DonorRoutes } from "../modules/Donor/donor.route";

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
]
moduleRoutes.forEach((route) => router.use(route.path, route.route))
export default router