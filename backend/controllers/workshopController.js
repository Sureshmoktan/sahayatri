import Workshop from "../models/Workshop.js";


// CREATE WORKSHOP
export const createWorkshop = async (req, res) => {
  try {

    const { name, phone, address, lat, lng, type } = req.body;

    if (!name || !phone || !lat || !lng || !type) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const workshop = await Workshop.create({
      name,
      phone,
      address,
      location: { lat, lng },
      type
    });

    res.status(201).json({
      message: "Workshop created successfully",
      workshop
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// GET ALL WORKSHOPS
export const getWorkshops = async (req, res) => {
  try {

    const workshops = await Workshop.find();

    res.status(200).json(workshops);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// GET SINGLE WORKSHOP
export const getWorkshopById = async (req, res) => {
  try {

    const workshop = await Workshop.findById(req.params.id);

    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    res.status(200).json(workshop);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// UPDATE WORKSHOP
export const updateWorkshop = async (req, res) => {
  try {

    const workshop = await Workshop.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    res.status(200).json({
      message: "Workshop updated",
      workshop
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// DELETE WORKSHOP
export const deleteWorkshop = async (req, res) => {
  try {

    const workshop = await Workshop.findByIdAndDelete(req.params.id);

    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    res.status(200).json({
      message: "Workshop deleted"
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};