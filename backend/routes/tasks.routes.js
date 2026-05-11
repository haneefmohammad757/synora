const express = require('express');
const router = express.Router();
const { getTasks, addTask, updateTask, deleteTask, getRecommendations } = require('../controllers/tasks.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);
router.route('/').get(getTasks).post(addTask);
router.get('/recommendations', getRecommendations);
router.route('/:id').put(updateTask).delete(deleteTask);
module.exports = router;
