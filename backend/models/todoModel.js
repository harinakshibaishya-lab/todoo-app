const db = require('../config/db');

const getTodosByUser = async (userId) => {
  const [rows] = await db.query(
    'SELECT * FROM todos WHERE user_id = ? AND is_deleted = FALSE ORDER BY created_at DESC',
    [userId]
  );
  return rows;
};

const createTodo = async (userId, title, description, priority, due_date) => {
  const [result] = await db.query(
    'INSERT INTO todos (user_id, title, description, priority, due_date) VALUES (?, ?, ?, ?, ?)',
    [userId, title, description, priority, due_date]
  );
  return result.insertId;
};

const getTodoById = async (todoId, userId) => {
  const [rows] = await db.query(
    'SELECT * FROM todos WHERE id = ? AND user_id = ?',
    [todoId, userId]
  );
  return rows[0];
};

const updateTodo = async (todoId, userId, fields) => {
  const { title, description, priority, status, due_date } = fields;
  await db.query(
    `UPDATE todos 
     SET title = ?, description = ?, priority = ?, status = ?, due_date = ?
     WHERE id = ? AND user_id = ?`,
    [title, description, priority, status, due_date, todoId, userId]
  );
};

const deleteTodo = async (todoId, userId) => {
  await db.query(
    'UPDATE todos SET is_deleted = TRUE WHERE id = ? AND user_id = ?',
    [todoId, userId]
  );
};

module.exports = {
  getTodosByUser,
  createTodo,
  getTodoById,
  updateTodo,
  deleteTodo
};