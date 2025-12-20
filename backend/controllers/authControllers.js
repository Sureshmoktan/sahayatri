// import Owner from "../models/Owner.js"
// import Admin from "../models/Admin.js"
// import bcrypt from "bcryptjs"
// import jwt from "jsonwebtoken"

// // Register Owner
// export const registerOwner = async (req, res) => {
//   const { fullName, email, password } = req.body
//   try {
//     const exists = await Owner.findOne({ email })
//     if (exists) return res.status(400).json({ message: "Email already exists" })

//     const hashedPassword = await bcrypt.hash(password, 10)
//     const owner = await Owner.create({ fullName, email, password: hashedPassword })

//     const token = jwt.sign({ id: owner._id, role: "owner" }, process.env.JWT_SECRET, { expiresIn: "7d" })
//     res.json({ user: owner, token })
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// }

// // Login Owner/Admin
// export const login = async (req, res) => {
//   const { email, password } = req.body
//   try {
//     let user = await Owner.findOne({ email })
//     let role = "owner"
//     if (!user) {
//       user = await Admin.findOne({ email })
//       role = "admin"
//     }
//     if (!user) return res.status(400).json({ message: "Invalid credentials" })

//     const isMatch = await bcrypt.compare(password, user.password)
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" })

//     const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: "7d" })
//     res.json({ user, token })
//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// }


import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register → automatically role: owner
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if(existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "owner"
    });

    res.status(201).json({ message: "Owner registered successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login → return role
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

   const userObj = user.toObject();

delete userObj.password;

// attach token
userObj.token = token;

res.json({
  message: "Login successful",
  user: userObj,
});
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
