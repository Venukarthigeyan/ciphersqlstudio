const express = require('express');
const router = express.Router();
const { getProgress, markComplete } = require('../controllers/progressController');

router.get('/:assignmentId', getProgress);
router.post('/complete', markComplete);

module.exports = router;