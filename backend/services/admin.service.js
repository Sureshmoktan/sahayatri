import User from "../models/User.js";
import Workshop from "../models/Workshop.js";
import { MESSAGES } from "../constants/messages.js";
import { ROLES } from "../constants/roles.js";

// ⭐ Get All Users
export const getAllUsersService = async () => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  return users;
};

// ⭐ Get All Workshops
export const getAllWorkshopsService = async () => {
  const workshops = await Workshop.find().sort({ createdAt: -1 });
  return workshops;
};

// ⭐ Delete User + their Workshop
export const adminDeleteUserService = async (id) => {
  const user = await User.findById(id);
  if (!user) throw { status: 404, message: MESSAGES.USER_NOT_FOUND };

  // ✅ Delete workshop if owner
  if (user.role === ROLES.OWNER) {
    await Workshop.deleteOne({ owner: user._id });
  }

  await User.findByIdAndDelete(id);
  return { message: MESSAGES.USER_DELETED };
};

// ⭐ Delete Workshop (admin only)
export const adminDeleteWorkshopService = async (id) => {
  const workshop = await Workshop.findById(id);
  if (!workshop) throw { status: 404, message: MESSAGES.WORKSHOP_NOT_FOUND };

  await Workshop.findByIdAndDelete(id);
  return { message: MESSAGES.WORKSHOP_DELETED };
};