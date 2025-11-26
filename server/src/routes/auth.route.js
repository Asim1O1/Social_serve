import express from "express";

import {
  getMe,
  loginUser,
  logOutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/auth.controller.js";

import { validate } from "../middleware/validate.js";
import { registerSchema } from "../validations/auth.validation.js";

import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.post("/register", validate(registerSchema), registerUser);

router.post("/login", loginUser);

router.post("/refresh-token", refreshAccessToken);

router.post("/logout", logOutUser);

router.get("/me", requireAuth, getMe);

export default router;
