import express from "express";
import { protect } from "../middleware/protectMidlleware.js";
import { restrictTo } from "../middleware/roleMiddleware.js";
import {
  createTransaction,
  getTransactionsBySubscription,
  getAllTransactions,
  getTransactionStats,
} from "../controller/TransactionController.js";

const router = express.Router();

// Routes for logged-in users
router.use(protect);

router.post("/", createTransaction);
router.get("/subscriptions/:subscriptionId/transactions", getTransactionsBySubscription);
router.get("/stats", getTransactionStats);

// Routes for admin only
router.use(restrictTo("admin"));
router.get("/admin/transactions", getAllTransactions);

export default router;