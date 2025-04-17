const express = require('express');
const { getPendingSpots, approveSpot, deleteSpot } = require('../controllers/admincontroller');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get("/pending-spots",verifyToken ,verifyAdmin, getPendingSpots)
router.put("/approve-spot/:id",verifyToken,verifyAdmin, approveSpot)
router.delete('/delete-spot/:id', verifyToken, verifyAdmin, deleteSpot);


module.exports = router