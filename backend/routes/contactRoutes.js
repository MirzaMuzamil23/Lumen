const express = require("express");
const router = express.Router();
const { submitMessage, listMessages } = require("../controllers/contactController");

router.post("/", submitMessage);
router.get("/", listMessages);

module.exports = router;
