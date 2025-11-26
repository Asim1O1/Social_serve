import User from "../models/user.model.js";
export const createUser = (data) => {
  return User.create(data);
};

export const findUserByEmail = (email) => {
  return User.findOne({ email }).lean();
};

export const findUserById = (id) => {
  return User.findById(id).lean();
};
export const findUserByResetToken = (hashedToken) =>
  User.findOne({ resetPasswordToken: hashedToken }).select("+password");
