const express = require("express");
const router = express.Router();
const { openDispute, getMyDisputes, getAllDisputes, resolveDispute } = require("../controllers/disputeController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.post("/", authMiddleware, openDispute);
router.get("/my", authMiddleware, getMyDisputes);
router.get("/all", authMiddleware, adminMiddleware, getAllDisputes);
router.put("/:id/resolve", authMiddleware, adminMiddleware, resolveDispute);

module.exports = router;