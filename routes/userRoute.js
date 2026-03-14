import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getCurrentUser,
} from "../controller/UserController.js";
import { restrictTo } from "../middleware/roleMiddleware.js";
import { protect } from "../middleware/protectMidlleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { userUpdateSchema } from "../validation/schema/userSchema.js";

const router = express.Router();

router.use(protect);
router.get("/me", getCurrentUser);
router.use(restrictTo("admin"));
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/updateUser/:id", validateRequest(userUpdateSchema), updateUser);
router.delete("/:id", deleteUser);

export default router;
