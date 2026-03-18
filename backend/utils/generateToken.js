// utils/generateToken.js
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role, // ✅ include role so middleware can use it
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

export default generateToken;