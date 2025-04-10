const express = require('express');
const { submitspot } = require('../controllers/spotcontroller');
const router = express.Router();

router.post("/submitspot",submitspot)

module.exports = router
