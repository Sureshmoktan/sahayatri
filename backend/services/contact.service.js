import Contact from "../models/Contact.js";
import nodemailer from "nodemailer";
import { MESSAGES } from "../constants/messages.js";

// ⭐ Send Email
const sendEmailNotification = async (form) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // sends to yourself
    subject: `New Contact Form Submission - ${form.service || "General Enquiry"}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:8px;border:1px solid #ddd"><strong>Name</strong></td><td style="padding:8px;border:1px solid #ddd">${form.name}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd"><strong>Phone</strong></td><td style="padding:8px;border:1px solid #ddd">${form.phone}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd"><strong>Email</strong></td><td style="padding:8px;border:1px solid #ddd">${form.email || "N/A"}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd"><strong>Service</strong></td><td style="padding:8px;border:1px solid #ddd">${form.service || "N/A"}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd"><strong>Message</strong></td><td style="padding:8px;border:1px solid #ddd">${form.message}</td></tr>
      </table>
    `,
  });
};

// ⭐ Save to DB + Send Email
export const submitContactService = async (body) => {
  const { name, phone, email, service, message } = body;

  if (!name || !phone || !message) {
    throw { status: 400, message: "Name, phone and message are required" };
  }

  // Save to DB
  const contact = await Contact.create({ name, phone, email, service, message });

  // Send email (don't block response if email fails)
  try {
    await sendEmailNotification({ name, phone, email, service, message });
  } catch (err) {
    console.error("Email send failed:", err.message);
  }

  return contact;
};

// ⭐ Get All Messages (admin)
export const getAllContactsService = async () => {
  return await Contact.find().sort({ createdAt: -1 });
};

// ⭐ Mark as Read (admin)
export const markAsReadService = async (id) => {
  const contact = await Contact.findByIdAndUpdate(id, { isRead: true }, { new: true });
  if (!contact) throw { status: 404, message: "Message not found" };
  return contact;
};