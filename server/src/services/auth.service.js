import { HTTP_STATUS } from "../constants/http.js";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../repository/auth.repository.js";
import assertOrThrow from "../utils/assertOrThrow.js";
import { createPasswordResetToken } from "../utils/generateResetToken.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

export const registerVolunteerService = async (data) => {
  const { firstName, lastName, email, phoneNumber, password } = data;

  // Check if email exists
  const existingUser = await findUserByEmail(email);
  assertOrThrow(
    !existingUser,
    HTTP_STATUS.BAD_REQUEST,
    "Email is already registered"
  );

  // Create volunteer account
  const user = await createUser({
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    role: "VOLUNTEER", // ← Hardcoded, secure
  });

  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };
};

export const registerOrganizerService = async (data) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    password,

    organizationName,
    organizationDescription,
    organizationType,
    organizationPhone,
    organizationEmail,
    organizationLocation,
    organizationLogo,
  } = data;

  // Check if email exists
  const existingUser = await findUserByEmail(email);
  assertOrThrow(
    !existingUser,
    HTTP_STATUS.BAD_REQUEST,
    "Email is already registered"
  );

  // Validate required organization fields
  assertOrThrow(
    organizationName,
    HTTP_STATUS.BAD_REQUEST,
    "Organization name is required"
  );

  // Create organizer account
  const user = await createUser({
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    role: "ADMIN", // ← Hardcoded, secure

    organizationName,
    organizationDescription: organizationDescription || null,
    organizationType: organizationType || null,
    organizationPhone: organizationPhone || null,
    organizationEmail: organizationEmail || null,
    organizationLocation: organizationLocation || null,
    organizationLogo: organizationLogo || null,
  });

  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    organizationName: user.organizationName,
  };
};
export const loginUserService = async ({ email, password }) => {
  const user = await findUserByEmail(email);
  assertOrThrow(user, HTTP_STATUS.UNAUTHORIZED, "Invalid email or password");

  const isPasswordValid = await user.comparePassword(password);
  assertOrThrow(
    isPasswordValid,
    HTTP_STATUS.UNAUTHORIZED,
    "Invalid email or password"
  );

  const accessToken = generateAccessToken({ id: user._id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id, role: user.role });

  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    accessToken,
    refreshToken,
  };
};

export const refreshTokenService = async (refreshToken) => {
  assertOrThrow(
    refreshToken,
    HTTP_STATUS.UNAUTHORIZED,
    "Refresh token is missing"
  );

  const payload = verifyRefreshToken(refreshToken);

  const accessToken = generateAccessToken({
    id: payload.id,
    role: payload.role,
  });

  return { accessToken };
};

export const logoutUserService = async () => {
  return { success: true };
};

export const getMeService = async (userId) => {
  const user = await findUserById(userId);

  assertOrThrow(user, HTTP_STATUS.NOT_FOUND, "User not found");

  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };
};

export const forgotPasswordService = async (email) => {
  const user = await findUserByEmail(email);
  assertOrThrow(
    user,
    HTTP_STATUS.OK,
    "If this email exists, a reset link was sent"
  );

  const { rawToken, hashedToken } = createPasswordResetToken();

  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  return rawToken;
};

export const resetPasswordService = async (token, newPassword) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await findUserByResetToken(hashedToken);

  assertOrThrow(
    user && user.resetPasswordExpire > Date.now(),
    HTTP_STATUS.BAD_REQUEST,
    "Reset token is invalid or expired"
  );

  user.password = newPassword;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return {
    message: "Password has been reset successfully",
  };
};
