// import Workshop from "../models/Workshop.js"

// // Add Workshop (owner)
// export const addWorkshop = async (req, res) => {
//   const { name, type, location } = req.body
//   const ownerId = req.user.id
//   try {
//     const exists = await Workshop.findOne({ owner: ownerId })
//     if (exists) return res.status(400).json({ message: "Owner can add only 1 workshop" })

//     const workshop = await Workshop.create({ name, type, location, owner: ownerId })
//     res.json(workshop)
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// }

// // Get all workshops
// export const getWorkshops = async (req, res) => {
//   try {
//     const workshops = await Workshop.find().populate("owner", "fullName email")
//     res.json(workshops)
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// }

// // Delete workshop (admin)
// export const deleteWorkshop = async (req, res) => {
//   try {
//     const workshop = await Workshop.findByIdAndDelete(req.params.id)
//     res.json({ message: "Workshop deleted", workshop })
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// }


import Workshop from "../models/Workshop.js";

// Add Workshop → only owner can add
export const addWorkshop = async (req, res) => {
  const { name, type, location } = req.body;

  console.log(req.body)
  const ownerId = req.user.id; // from auth middleware

  try {
    // check if owner already has a workshop
    const existing = await Workshop.findOne({ owner: ownerId });
    if(existing) return res.status(400).json({ message: "Owner can only have one workshop" });

    const newWorkshop = await Workshop.create({
      name,
      type,
      location,
      owner: ownerId
    });

    res.status(201).json({ message: "Workshop added", workshop: newWorkshop });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Fetch all workshops
export const getWorkshops = async (req, res) => {
  try {
    const workshops = await Workshop.find({req.params.id}).populate("owner", "name email");
    res.json(workshops);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete workshop → only owner can delete
export const deleteWorkshop = async (req, res) => {
  const ownerId = req.user.id; // from auth middleware

  try {
    const workshop = await Workshop.findByIdAndDelete(req.params.id);
    if(!workshop) return res.status(404).json({ message: "Workshop not found" });
    if(workshop.owner.toString() !== ownerId) return res.status(403).json({ message: "Not authorized" });
    res.json({ message: "Workshop deleted", workshop });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

