const express = require('express');
const { submitspot, addReview, getReviewsBySpot, getRatingsSummary, getTopRatedSpots, getSpotsbydistrict, getProfile, deleteAccount, searchspot } = require('../controllers/usercontroller');
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();

router.post("/submitspot", verifyToken , upload.array('images', 5), submitspot)
router.post("/addreview",verifyToken, addReview)
router.get("/getReviewsBySpot/:spotId",getReviewsBySpot)
router.get("/searchspot", searchspot)
router.get('/ratings-summary', getRatingsSummary);
router.get("/top-rated", getTopRatedSpots);
router.get("/spotbydistrict", getSpotsbydistrict);
router.get('/profile', verifyToken, getProfile);
router.delete('/profile', verifyToken, deleteAccount);

module.exports = router