import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: true 
  },

  email: { 
    type: String, 
    required: true, 
    unique: true 
  },

  password: { 
    type: String, 
    required: true 
  },

  role: { 
    type: String, 
    enum: ["owner", "admin"], 
    default: "owner" 
  },

  isVerified: { 
    type: Boolean, 
    default: true   // user created only after verification
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model("User", UserSchema);