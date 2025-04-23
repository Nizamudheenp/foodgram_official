const express = require('express');
const { getPendingSpots, approveSpot, deleteSpot, getSpots, getApprovedSpots, editSpot } = require('../controllers/admincontroller');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get("/pending-spots",verifyToken ,verifyAdmin, getPendingSpots)
router.get("/get-spots",verifyToken ,verifyAdmin, getApprovedSpots)
router.put("/approve-spot/:id",verifyToken,verifyAdmin, approveSpot)
router.put('/edit-spot/:id', verifyToken, verifyAdmin, editSpot);
router.delete('/delete-spot/:id', verifyToken, verifyAdmin, deleteSpot);


module.exports = router