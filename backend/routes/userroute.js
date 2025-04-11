const express = require('express');
const { submitspot, addReview, getReviewsBySpot, getRatingsSummary, getTopRatedSpots, getSpotsbydistrict } = require('../controllers/usercontroller');
const router = express.Router();

router.post("/submitspot",submitspot)
router.post("/addreview",addReview)
router.get("/getReviewsBySpot/:spotId",getReviewsBySpot)
router.get('/ratings-summary', getRatingsSummary);
router.get("/top-rated", getTopRatedSpots);
router.get("/spotbydistrict", getSpotsbydistrict);

module.exports = router