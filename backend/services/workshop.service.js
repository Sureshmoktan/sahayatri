import Workshop from "../models/Workshop.js";
import { MESSAGES } from "../constants/messages.js";
import { ROLES } from "../constants/roles.js";

// ⭐ Create Workshop
export const createWorkshopService = async (userId, userEmail, body) => {
  const { name, phone, address, location, type } = body;
  const { lat, lng } = location || {};

  if (!name || !phone || !lat || !lng || !type) {
    throw { status: 400, message: "Required fields missing" };
  }

  // ✅ One workshop per account
  const existing = await Workshop.findOne({ email: userEmail });
  if (existing) {
    throw {
      status: 400,
      message: "You have already registered a workshop with this account.",
    };
  }

  const workshop = await Workshop.create({
    name,
    phone,
    address,
    location: { lat, lng },
    type,
    email: userEmail,
    createdBy: userId,
  });

  return workshop;
};

// ⭐ Get All Workshops
export const getWorkshopsService = async () => {
  const workshops = await Workshop.find().populate("createdBy", "name email");
  return workshops;
};

// ⭐ Get My Workshops
export const getMyWorkshopsService = async (userId) => {
  const workshops = await Workshop.find({ createdBy: userId });
  return workshops;
};

// ⭐ Get Single Workshop
export const getWorkshopByIdService = async (id) => {
  const workshop = await Workshop.findById(id).populate("createdBy", "name email");
  if (!workshop) throw { status: 404, message: MESSAGES.WORKSHOP_NOT_FOUND };
  return workshop;
};

// ⭐ Update Workshop
export const updateWorkshopService = async (id, requesterId, requesterRole, body) => {
  const workshop = await Workshop.findById(id);
  if (!workshop) throw { status: 404, message: MESSAGES.WORKSHOP_NOT_FOUND };

  // ✅ Only owner of workshop or admin can update
  if (
    workshop.createdBy.toString() !== requesterId &&
    requesterRole !== ROLES.ADMIN
  ) {
    throw { status: 403, message: MESSAGES.UNAUTHORIZED };
  }

  const updatedWorkshop = await Workshop.findByIdAndUpdate(id, body, { new: true });
  return updatedWorkshop;
};

// ⭐ Delete Workshop
export const deleteWorkshopService = async (id, requesterId, requesterRole) => {
  const workshop = await Workshop.findById(id);
  if (!workshop) throw { status: 404, message: MESSAGES.WORKSHOP_NOT_FOUND };

  // ✅ Only owner of workshop or admin can delete
  if (
    workshop.createdBy.toString() !== requesterId &&
    requesterRole !== ROLES.ADMIN
  ) {
    throw { status: 403, message: MESSAGES.UNAUTHORIZED };
  }

  await Workshop.findByIdAndDelete(id);
  return { message: MESSAGES.WORKSHOP_DELETED };
};