const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getMe,
  updateMe,
  changePassword,
  forgotPassword,
  resetPassword,
  listUsers,
  updateUserRole,
  deleteUser,
} = require("../controllers/authController");
const requireAuth = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", requireAuth, getMe);
router.patch("/me", requireAuth, updateMe);
router.patch("/change-password", requireAuth, changePassword);
router.get("/users", requireAuth, requireAdmin, listUsers);
router.patch("/users/:id/role", requireAuth, requireAdmin, updateUserRole);
router.delete("/users/:id", requireAuth, requireAdmin, deleteUser);

module.exports = router;