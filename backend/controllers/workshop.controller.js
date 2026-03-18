import asyncHandler from "../utils/asyncHandler.js";
import { HTTP } from "../constants/httpStatus.js";
import { MESSAGES } from "../constants/messages.js";
import {
  createWorkshopService,
  getWorkshopsService,
  getMyWorkshopsService,
  getWorkshopByIdService,
  updateWorkshopService,
  deleteWorkshopService,
} from "../services/workshop.service.js";

// ⭐ Create Workshop
export const createWorkshop = asyncHandler(async (req, res) => {
  const workshop = await createWorkshopService(
    req.user._id,
    req.user.email,
    req.body
  );

  res.status(HTTP.CREATED).json({
    message: MESSAGES.WORKSHOP_CREATED,
    workshop,
  });
});

// ⭐ Get All Workshops
export const getWorkshops = asyncHandler(async (req, res) => {
  const workshops = await getWorkshopsService();
  res.status(HTTP.OK).json(workshops);
});

// ⭐ Get My Workshops
export const getMyWorkshops = asyncHandler(async (req, res) => {
  const workshops = await getMyWorkshopsService(req.user._id);
  res.status(HTTP.OK).json(workshops);
});

// ⭐ Get Single Workshop
export const getWorkshopById = asyncHandler(async (req, res) => {
  const workshop = await getWorkshopByIdService(req.params.id);
  res.status(HTTP.OK).json(workshop);
});

// ⭐ Update Workshop
export const updateWorkshop = asyncHandler(async (req, res) => {
  const workshop = await updateWorkshopService(
    req.params.id,
    req.user._id.toString(),
    req.user.role,
    req.body
  );

  res.status(HTTP.OK).json({
    message: MESSAGES.WORKSHOP_UPDATED,
    workshop,
  });
});

// ⭐ Delete Workshop
export const deleteWorkshop = asyncHandler(async (req, res) => {
  const result = await deleteWorkshopService(
    req.params.id,
    req.user._id.toString(),
    req.user.role
  );

  res.status(HTTP.OK).json(result);
});