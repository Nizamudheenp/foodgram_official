const express = require('express');
const { getPendingSpots, approveSpot } = require('../controllers/admincontroller');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get("/pendingspot",verifyToken ,verifyAdmin, getPendingSpots)
router.put("/approvespot/:id",verifyToken,verifyAdmin, approveSpot)

module.exports = router