import { Router } from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";

const router = Router();

const moduleRoutes = [
{
    path: '/users',
    route: AuthRoutes
  },
]
moduleRoutes.forEach((route) => router.use(route.path, route.route))
export default router