import express from "express";
import { login, singup, updateUser } from "../controller/AuthController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import {
  loginUserSchema,
  userCreateSchema,
  userUpdateSchema,
} from "../validation/schema/userSchema.js";
import { protect } from "../middleware/protectMidlleware.js";
const router = express.Router();
router.post("/signup", validateRequest(userCreateSchema),singup);
router.post("/login", validateRequest(loginUserSchema), login);
router.patch("/updateUser/:id", validateRequest(userUpdateSchema), protect,updateUser);
export default router;