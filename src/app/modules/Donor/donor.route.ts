// src/app/modules/Donor/donor.routes.ts
import { Router } from 'express';
import { DonorControllers } from './donor.controller';

const router = Router();

router.get('/', DonorControllers.getAllDonors);
router.get('/:id', DonorControllers.getSingleDonor);

export const DonorRoutes = router;