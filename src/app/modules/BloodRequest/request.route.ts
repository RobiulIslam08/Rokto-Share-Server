// src/app/modules/BloodRequest/request.routes.ts
import { Router } from 'express';
import { BloodRequestControllers } from './request.controller';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BloodRequestValidations } from './request.validation';

const router = Router();

// Create blood request (auth required)
router.post(
  '/create',
  auth('donor'),
  validateRequest(BloodRequestValidations.createBloodRequestSchemaValidation),
  BloodRequestControllers.createBloodRequest
);

// ✅ Get current user's blood requests (যে requests এই user করেছে)
router.get(
  '/my-requests',
  auth('donor'),
  BloodRequestControllers.getMyBloodRequests
);

// ✅ Get requests for current donor (যে requests এই donor এর কাছে এসেছে)
router.get(
  '/donor-requests',
  auth('donor'),
  BloodRequestControllers.getRequestsForDonor
);

// Get all blood requests
router.get('/', BloodRequestControllers.getAllBloodRequests);

// Get single blood request
router.get('/:id', BloodRequestControllers.getSingleBloodRequest);

// ✅ Accept blood request
router.patch(
  '/:id/accept',
  auth('donor'),
  BloodRequestControllers.acceptBloodRequest
);

// ✅ Reject blood request
router.patch(
  '/:id/reject',
  auth('donor'),
  BloodRequestControllers.rejectBloodRequest
);

// ✅ Complete blood request
router.patch(
  '/:id/complete',
  auth('donor'),
  BloodRequestControllers.completeBloodRequest
);

// ✅ Cancel blood request
router.patch(
  '/:id/cancel',
  auth('donor'),
  BloodRequestControllers.cancelBloodRequest
);

// Update blood request (auth required)
router.patch(
  '/:id',
  auth('donor'),
  validateRequest(BloodRequestValidations.updateStatusSchemaValidation),
  BloodRequestControllers.updateBloodRequest
);

// Delete blood request (auth required)
router.delete('/:id', auth('donor'), BloodRequestControllers.deleteBloodRequest);

router.get(
  '/donor/donation-history',
  auth('donor'), // নিশ্চিত করে যে শুধুমাত্র লগইন করা ডোনর এটি অ্যাক্সেস করতে পারবে
  BloodRequestControllers.getDonorDonationHistory,
);

export const BloodRequestRoutes = router;