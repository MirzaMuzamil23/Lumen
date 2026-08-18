const ProjectModel = require("../models/projectModel");
const UserModel = require("../models/userModel");

// GET /api/projects  (admin only) — every project across all clients
exports.listAll = async (req, res, next) => {
  try {
    const projects = await ProjectModel.findAll();
    res.json({ data: projects });
  } catch (err) {
    next(err);
  }
};

// GET /api/projects/mine  (protected) — the logged-in user's own projects
exports.listMine = async (req, res, next) => {
  try {
    const projects = await ProjectModel.findByClientId(req.userId);
    res.json({ data: projects });
  } catch (err) {
    next(err);
  }
};

// POST /api/projects  (admin only)
exports.create = async (req, res, next) => {
  try {
    const { name, clientId, status, progress, notes } = req.body;
    if (!name || !clientId) {
      return res.status(400).json({ message: "Project name and client are required." });
    }

    const client = await UserModel.findById(Number(clientId));
    if (!client) {
      return res.status(404).json({ message: "Selected client doesn't exist." });
    }

    const project = await ProjectModel.create({
      name,
      clientId: Number(clientId),
      status,
      progress,
      notes,
    });
    res.status(201).json({ message: "Project created.", data: project });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/projects/:id  (admin only)
exports.update = async (req, res, next) => {
  try {
    const { name, status, progress, notes } = req.body;
    const updated = await ProjectModel.update(Number(req.params.id), {
      name,
      status,
      progress,
      notes,
    });
    if (!updated) return res.status(404).json({ message: "Project not found." });
    res.json({ message: "Project updated.", data: updated });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/projects/:id  (admin only)
exports.remove = async (req, res, next) => {
  try {
    const deleted = await ProjectModel.deleteById(Number(req.params.id));
    if (!deleted) return res.status(404).json({ message: "Project not found." });
    res.json({ message: "Project deleted." });
  } catch (err) {
    next(err);
  }
};