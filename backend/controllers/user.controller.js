import asyncHandler from "../utils/asyncHandler.js";
import { HTTP } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js";
import {
  getSingleUserService,
  updateUserService,
  deleteUserService,
  getAllUsersService,
} from "../services/user.service.js";

// ⭐ Get Single User
export const getSingleUser = asyncHandler(async (req, res) => {
  const user = await getSingleUserService(req.params.id);
  res.status(HTTP.OK).json(user);
});

// ⭐ Update User
export const updateUser = asyncHandler(async (req, res) => {
  const updatedUser = await updateUserService(
    req.user._id.toString(),  // who is requesting
    req.user.role,            // their role
    req.params.id,            // who to update
    req.body                  // what to update
  );

  res.status(HTTP.OK).json({
    message: MESSAGES.USER_UPDATED,
    user: updatedUser,
  });
});

// ⭐ Delete User
export const deleteUser = asyncHandler(async (req, res) => {
  const result = await deleteUserService(
    req.user._id.toString(),  // who is requesting
    req.user.role,            // their role
    req.params.id             // who to delete
  );

  res.status(HTTP.OK).json(result);
});

// ⭐ Get All Users (Admin only)
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsersService();
  res.status(HTTP.OK).json(users);
});

