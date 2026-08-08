const {
  getTodosByUser,
  createTodo,
  getTodoById,
  updateTodo,
  deleteTodo
} = require('../models/todoModel');

const getTodos = async (req, res) => {
  try {
    const todos = await getTodosByUser(req.user.id);
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addTodo = async (req, res) => {
  try {
    const { title, description, priority, due_date } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const todoId = await createTodo(
      req.user.id,
      title,
      description || null,
      priority || 'medium',
      due_date || null
    );

    res.status(201).json({ message: 'Todo created', todoId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const editTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const existingTodo = await getTodoById(id, req.user.id);
    if (!existingTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const updatedFields = {
      title: req.body.title || existingTodo.title,
      description: req.body.description ?? existingTodo.description,
      priority: req.body.priority || existingTodo.priority,
      status: req.body.status || existingTodo.status,
      due_date: req.body.due_date || existingTodo.due_date
    };

    await updateTodo(id, req.user.id, updatedFields);
    res.status(200).json({ message: 'Todo updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const removeTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const existingTodo = await getTodoById(id, req.user.id);
    if (!existingTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    await deleteTodo(id, req.user.id);
    res.status(200).json({ message: 'Todo deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getTodos, addTodo, editTodo, removeTodo };