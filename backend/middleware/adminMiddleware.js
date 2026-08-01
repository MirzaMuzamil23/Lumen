// Must run AFTER requireAuth (needs req.userRole to already be set).
module.exports = function requireAdmin(req, res, next) {
  if (req.userRole !== "admin") {
    return res.status(403).json({ message: "Admin access required." });
  }
  next();
};