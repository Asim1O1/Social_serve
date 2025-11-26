import {
  forgotPasswordService,
  getMeService,
  loginUserService,
  logoutUserService,
  refreshTokenService,
  registerOrganizerService,
  registerVolunteerService,
  resetPasswordService,
} from "../services/auth.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { success } from "../utils/response.js";

export const registerVolunteer = asyncHandler(async (req, res) => {
  const data = await registerVolunteerService(req.body);
  return success(res, "Volunteer registered successfully", data);
});

export const registerOrganizer = asyncHandler(async (req, res) => {
  const data = await registerOrganizerService(req.body);
  return success(res, "Organizer registered successfully", data);
});

export const loginUser = asyncHandler(async (req, res) => {
  const data = await loginUserService(req.body);

  return success(res, "User logged in successfully", data);
});

export const logOutUser = asyncHandler(async (req, res) => {
  await logoutUserService();
  return success(res, "User logged out successfully");
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const data = await refreshTokenService(req.body.refreshToken);
  return success(res, "Token refreshed", data);
});

export const getMe = asyncHandler(async (req, res) => {
  const data = await getMeService(req.user.id);
  return success(res, "User data retrieved successfully", data);
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const resetToken = await forgotPasswordService(req.body.email);

  // TO-DO: Send email backend-side
  // sendResetEmail(req.body.email, resetToken);

  return success(res, "Password reset link sent to email");
});

export const resetPassword = asyncHandler(async (req, res) => {
  const data = await resetPasswordService(
    req.params.resetToken,
    req.body.password
  );

  return success(res, "Password has been reset successfully", data);
});
