import asyncHandler from "../utils/asyncHandler.js";
import { HTTP } from "../constants/httpStatus.js";
import {
  getAllUsersService,
  getAllWorkshopsService,
  adminDeleteUserService,
  adminDeleteWorkshopService,
} from "../services/admin.service.js";

// ⭐ Get All Users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsersService();
  res.status(HTTP.OK).json(users);
});

// ⭐ Get All Workshops
export const getAllWorkshops = asyncHandler(async (req, res) => {
  const workshops = await getAllWorkshopsService();
  res.status(HTTP.OK).json(workshops);
});

// ⭐ Delete User
export const deleteUser = asyncHandler(async (req, res) => {
  const result = await adminDeleteUserService(req.params.id);
  res.status(HTTP.OK).json(result);
});

// ⭐ Delete Workshop
export const adminDeleteWorkshop = asyncHandler(async (req, res) => {
  const result = await adminDeleteWorkshopService(req.params.id);
  res.status(HTTP.OK).json(result);
});