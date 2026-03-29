import db from '../db/index.js';

export const Question = {
  findAllActive: () => {
    const stmt = db.prepare('SELECT * FROM questions WHERE is_active = 1 ORDER BY order_index ASC');
    return stmt.all();
  },

  findAll: () => {
    const stmt = db.prepare('SELECT * FROM questions ORDER BY order_index ASC');
    return stmt.all();
  },

  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM questions WHERE id = ?');
    return stmt.get(id);
  },

  create: (id, text, type, options, required, order_index) => {
    const stmt = db.prepare('INSERT INTO questions (id, text, type, options, required, order_index, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)');
    return stmt.run(id, text, type, options, required, order_index);
  },

  update: (id, text, type, options, required) => {
    const stmt = db.prepare('UPDATE questions SET text = ?, type = ?, options = ?, required = ? WHERE id = ?');
    return stmt.run(text, type, options, required, id);
  },

  deactivate: (id) => {
    const stmt = db.prepare('UPDATE questions SET is_active = 0 WHERE id = ?');
    return stmt.run(id);
  },

  updateOrder: (id, order_index) => {
    const stmt = db.prepare('UPDATE questions SET order_index = ? WHERE id = ?');
    return stmt.run(order_index, id);
  }
};
