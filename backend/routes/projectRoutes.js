const express = require("express");
const router = express.Router();
const { listAll, listMine, create, update, remove } = require("../controllers/projectController");
const requireAuth = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");

router.get("/mine", requireAuth, listMine);
router.get("/", requireAuth, requireAdmin, listAll);
router.post("/", requireAuth, requireAdmin, create);
router.patch("/:id", requireAuth, requireAdmin, update);
router.delete("/:id", requireAuth, requireAdmin, remove);

module.exports = router;