const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');

router.post('/create', calendarController.createNote);
router.delete('/', calendarController.deleteNote);
router.post('/update', calendarController.updateNote)

module.exports = router;