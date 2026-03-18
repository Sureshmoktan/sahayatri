import User from "../models/User.js";
import Workshop from "../models/Workshop.js";
import bcrypt from "bcrypt";
import { MESSAGES } from "../constants/messages.js";
import { ROLES } from "../constants/roles.js";

// ⭐ Get Single User
export const getSingleUserService = async (id) => {
  const user = await User.findById(id).select("-password");
  if (!user) throw { status: 404, message: MESSAGES.USER_NOT_FOUND };
  return user;
};

// ⭐ Update User (Self OR Admin)
export const updateUserService = async (requesterId, requesterRole, targetId, body) => {
  const { fullName, email, password, role } = body;

  // ✅ Only self or admin can update
  if (requesterId !== targetId && requesterRole !== ROLES.ADMIN) {
    throw { status: 403, message: MESSAGES.UNAUTHORIZED };
  }

  const user = await User.findById(targetId);
  if (!user) throw { status: 404, message: MESSAGES.USER_NOT_FOUND };

  // ✅ Only admin can change role
  if (role && requesterRole !== ROLES.ADMIN) {
    throw { status: 403, message: "Only admin can change role" };
  }

  user.fullName = fullName || user.fullName;
  user.email    = email    || user.email;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  if (role && requesterRole === ROLES.ADMIN) {
    user.role = role;
  }

  const updatedUser = await user.save();
  const userObj = updatedUser.toObject();
  delete userObj.password;

  return userObj;
};

// ⭐ Delete User + Workshop if owner
export const deleteUserService = async (requesterId, requesterRole, targetId) => {
  // ✅ Only self or admin can delete
  if (requesterId !== targetId && requesterRole !== ROLES.ADMIN) {
    throw { status: 403, message: MESSAGES.UNAUTHORIZED };
  }

  const user = await User.findById(targetId);
  if (!user) throw { status: 404, message: MESSAGES.USER_NOT_FOUND };

  // ✅ Delete workshop if owner using correct field
  if (user.role === ROLES.OWNER) {
    await Workshop.deleteOne({ createdBy: user._id });
  }

  await user.deleteOne();
  return { message: MESSAGES.USER_DELETED };
};

// ⭐ Get All Users (Admin only)
export const getAllUsersService = async () => {
  const users = await User.find().select("-password");
  return users;
};