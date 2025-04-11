const express = require('express');
const { getPendingSpots, approveSpot } = require('../controllers/admincontroller');
const router = express.Router();

router.get("/pendingspot",getPendingSpots)
router.put("/approvespot/:id",approveSpot)

module.exports = router