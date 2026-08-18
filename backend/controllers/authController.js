const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const UserModel = require("../models/userModel");

const signToken = (userId, role) =>
  jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// POST /api/auth/signup
exports.signup = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }

    const existing = await UserModel.findByEmail(email.toLowerCase());
    if (existing) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      fullName,
      email: email.toLowerCase(),
      passwordHash,
    });

    const token = signToken(user.id, user.role);
    res.status(201).json({
      message: "Account created successfully.",
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await UserModel.findByEmail(email.toLowerCase());
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = signToken(user.id, user.role);
    res.json({
      message: "Logged in successfully.",
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (err) {
    next(err);
  }
};
// POST /api/auth/forgot-password
// NOTE: this starter has no email service wired up. In real production you'd
// email `resetUrl` to the user instead of returning it in the response.
// For now it's returned directly so the flow is fully testable end-to-end.
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await UserModel.findByEmail(email.toLowerCase());
    if (!user) {
      return res.json({
        message: "If that email is registered, a reset link has been generated.",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await UserModel.setResetToken(user.id, tokenHash, expiresAt);

    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/reset-password?token=${rawToken}`;

    res.json({
      message: "If that email is registered, a reset link has been generated.",
      // Demo-only field — remove once real email delivery is wired up.
      resetUrl,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/reset-password
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required." });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters." });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const user = await UserModel.findByResetTokenHash(tokenHash);
    if (!user) {
      return res.status(400).json({ message: "This reset link is invalid or has expired." });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await UserModel.updatePassword(user.id, passwordHash);
    await UserModel.clearResetToken(user.id);

    res.json({ message: "Password reset successfully. You can now log in." });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me  (protected)
exports.getMe = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/auth/me  (protected) — update own profile
exports.updateMe = async (req, res, next) => {
  try {
    const { fullName } = req.body;
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ message: "Full name is required." });
    }
    const user = await UserModel.updateProfile(req.userId, { fullName: fullName.trim() });
    res.json({ message: "Profile updated.", user });
  } catch (err) {
    next(err);
  }
};
// PATCH /api/auth/change-password  (protected)
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required." });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters." });
    }

    const user = await UserModel.findByIdFull(req.userId);
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await UserModel.updatePassword(req.userId, passwordHash);
    res.json({ message: "Password updated successfully." });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/auth/users/:id/role  (protected, admin only)
exports.updateUserRole = async (req, res, next) => {
  try {
    const targetId = Number(req.params.id);
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Role must be 'user' or 'admin'." });
    }
    if (targetId === req.userId) {
      return res.status(400).json({ message: "You can't change your own role." });
    }

    const updated = await UserModel.updateRole(targetId, role);
    if (!updated) return res.status(404).json({ message: "User not found." });

    res.json({ message: "Role updated.", user: updated });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/auth/users/:id  (protected, admin only)
exports.deleteUser = async (req, res, next) => {
  try {
    const targetId = Number(req.params.id);
    if (targetId === req.userId) {
      return res.status(400).json({ message: "You can't delete your own account." });
    }

    const deleted = await UserModel.deleteById(targetId);
    if (!deleted) return res.status(404).json({ message: "User not found." });

    res.json({ message: "User deleted." });
  } catch (err) {
    next(err);
  }
};


// GET /api/auth/users  (protected, admin only) — list all users
exports.listUsers = async (req, res, next) => {
  try {
    const users = await UserModel.findAll();
    const totalUsers = await UserModel.countAll();
    const totalAdmins = users.filter((u) => u.role === "admin").length;
    res.json({
      data: users,
      stats: {
        total: totalUsers,
        admins: totalAdmins,
        regular: totalUsers - totalAdmins,
      },
    });
  } catch (err) {
    next(err);
  }
};