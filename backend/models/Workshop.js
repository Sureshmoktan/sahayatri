import mongoose from "mongoose";

const WorkshopSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true
  },

  phone: {
    type: String,
    required: true
  },

  address: {
    type: String
  },

  location: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },

  type: {
    type: String,
    enum: ["bike", "car", "both"],
    required: true
  },

  // ✅ Automatically taken from the logged-in user — never typed by user
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },

  // ✅ Reference to which user created this workshop
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export default mongoose.model("Workshop", WorkshopSchema);