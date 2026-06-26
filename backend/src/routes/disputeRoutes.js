const express = require("express");
const router = express.Router();
const { openDispute, getMyDisputes, getAllDisputes, resolveDispute } = require("../controllers/disputeController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, openDispute);
router.get("/my", authMiddleware, getMyDisputes);
router.get("/all", authMiddleware, getAllDisputes);
router.put("/:id/resolve", authMiddleware, resolveDispute);

module.exports = router;