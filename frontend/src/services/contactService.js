import API from "../api/axios";

export const submitContact = (formData) => API.post("/contact", formData);
export const getAllContacts = () => API.get("/contact");
export const markAsRead = (id) => API.patch(`/contact/${id}/read`);