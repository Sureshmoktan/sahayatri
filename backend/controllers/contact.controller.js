import asyncHandler from "../utils/asyncHandler.js";
import { HTTP } from "../constants/httpStatus.js";
import {
  submitContactService,
  getAllContactsService,
  markAsReadService,
} from "../services/contact.service.js";

// ⭐ Submit Contact Form (public)
export const submitContact = asyncHandler(async (req, res) => {
  const contact = await submitContactService(req.body);
  res.status(HTTP.CREATED).json({
    message: "Message sent successfully",
    contact,
  });
});

// ⭐ Get All Messages (admin)
export const getAllContacts = asyncHandler(async (req, res) => {
  const contacts = await getAllContactsService();
  res.status(HTTP.OK).json(contacts);
});

// ⭐ Mark as Read (admin)
export const markAsRead = asyncHandler(async (req, res) => {
  const contact = await markAsReadService(req.params.id);
  res.status(HTTP.OK).json(contact);
});