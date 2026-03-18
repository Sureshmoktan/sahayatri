import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// ── Users ──
export const getAllUsers = async () => {
  const res = await axios.get(`${API}/users`, authHeaders());
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await axios.delete(`${API}/users/${id}`, authHeaders());
  return res.data;
};

// ── Workshops ──
export const getAllWorkshops = async () => {
  const res = await axios.get(`${API}/workshops`, authHeaders());
  return res.data;
};

export const deleteWorkshop = async (id) => {
  const res = await axios.delete(`${API}/workshops/${id}`, authHeaders());
  return res.data;
};