import express from "express";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  createSubscriptionSchema,
  updateSubscriptionSchema,
} from "../validation/schema/subscriptionSchema.js";
import {
  createSubscription,
  updateSubscription,
} from "../controller/SubscriptionController.js";
import { protect } from "../middleware/protectMidlleware.js";

const router = express.Router();
router.use(protect);
router.post(
  "/",
  validateRequest(createSubscriptionSchema),
  createSubscription,
);
router.put(
  "/",
  validateRequest(updateSubscriptionSchema),
  updateSubscription,
);
export default router;
