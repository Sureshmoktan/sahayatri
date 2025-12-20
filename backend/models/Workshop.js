import mongoose from "mongoose";

const workshopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["bike","car","both"], required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export default mongoose.model("Workshop", workshopSchema);
