const express = require('express');
const router = express.Router();
const { getNotes, addNote, deleteNote } = require('../controllers/notes.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.route('/').get(getNotes).post(addNote);
router.route('/:id').delete(deleteNote);
module.exports = router;
