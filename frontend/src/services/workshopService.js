import API from "../api/axios";

export const getNearbyWorkshops = async () => {
  try {
    const response = await API.get("/workshops");
    return response.data;
  } catch (error) {
    console.error("Error fetching workshops:", error);
    throw error;
  }
};

// Create a new workshop
export const createWorkshop = async (workshopData) => {
  try {
    const response = await API.post("/workshops", workshopData);
    return response.data;
  } catch (error) {
    console.error("Error creating workshop:", error);
    throw error;
  }
};

// Delete a workshop by ID
export const deleteWorkshop = async (workshopId) => {
  try {
    const response = await API.delete(`/workshops/${workshopId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting workshop:", error);
    throw error;
  }
};

// Get logged-in user's workshops
export const getMyWorkshops = async () => {
  const response = await API.get("/workshops/my");
  return response.data;
};

// Get a single workshop by ID
export const getWorkshopById = async (workshopId) => {
  try {
    const response = await API.get(`/workshops/${workshopId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching workshop:", error);
    throw error;
  }
};

// Update a workshop by ID
export const updateWorkshop = async (workshopId, workshopData) => {
  try {
    const response = await API.put(`/workshops/${workshopId}`, workshopData);
    return response.data;
  } catch (error) {
    console.error("Error updating workshop:", error);
    throw error;
  }
};