const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getTodos, addTodo, editTodo, removeTodo } = require('../controllers/todoController');

// All routes below are protected — user must send a valid JWT token
router.get('/', protect, getTodos);
router.post('/', protect, addTodo);
router.put('/:id', protect, editTodo);
router.delete('/:id', protect, removeTodo);

module.exports = router;