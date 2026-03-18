// ── isAdmin middleware ──
// Use AFTER verifyToken so req.user is already set

export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized. Please login." });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden. Admins only." });
  }

  next();
};