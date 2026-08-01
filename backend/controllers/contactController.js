const ContactModel = require("../models/contactModel");

// POST /api/contact
exports.submitMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: "Name, email and message are required." });
    }

    const saved = await ContactModel.create({ name, email, subject, message });
    res.status(201).json({
      message: "Thanks — your message has been received.",
      data: saved,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/contact  (admin/debug use)
exports.listMessages = async (req, res, next) => {
  try {
    const messages = await ContactModel.findAll();
    res.json({ data: messages });
  } catch (err) {
    next(err);
  }
};
