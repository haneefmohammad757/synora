const express = require('express');
const router = express.Router();
const { saveSession } = require('../controllers/focus.controller');
const { protect } = require('../middleware/auth.middleware');
router.post('/', protect, saveSession);
module.exports = router;
