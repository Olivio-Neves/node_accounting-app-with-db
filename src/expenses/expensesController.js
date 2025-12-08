/* eslint-disable no-console */
'use strict';

const pool = require('../db');

async function listExpenses(req, res) {
  const { userId, categoryId, from, to } = req.query;

  let query = 'SELECT * FROM expenses WHERE 1=1';
  const params = [];

  if (userId) {
    params.push(userId);
    query += ` AND user_id = $${params.length}`;
  }

  if (categoryId) {
    params.push(categoryId);
    query += ` AND category_id = $${params.length}`;
  }

  if (from) {
    params.push(from);
    query += ` AND date >= $${params.length}`;
  }

  if (to) {
    params.push(to);
    query += ` AND date <= $${params.length}`;
  }

  query += ' ORDER BY id ASC';

  try {
    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (err) {
    console.error('DB error listExpenses:', err);
    res.status(500).json({ message: 'Database error' });
  }
}

async function listExpensesById(req, res) {
  const id = parseInt(req.params.id);

  try {
    const result = await pool.query('SELECT * FROM expenses WHERE id = $1', [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('DB error listExpensesById:', err);
    res.status(500).json({ message: 'Database error' });
  }
}

async function createExpenses(req, res) {
  const { userId, categoryId, amount, date, title, note } = req.body;

  if (!userId || !categoryId || !amount || !date || !title) {
    return res.status(400).json({ message: 'Missing parameter' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO expenses (user_id, category_id, amount, date, title, note)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, categoryId, amount, date, title, note || ''],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('DB error createExpenses:', err);

    if (err.code === '23503') {
      return res
        .status(400)
        .json({ message: 'User or Category does not exist' });
    }

    res.status(500).json({ message: 'Database error' });
  }
}

async function putExpensesById(req, res) {
  const id = parseInt(req.params.id);
  const { userId, categoryId, amount, date, title, note } = req.body;

  if (!userId || !categoryId || !amount || !date || !title) {
    return res.status(400).json({ message: 'Missing parameter' });
  }

  try {
    const result = await pool.query(
      `UPDATE expenses SET
         user_id = $1,
         category_id = $2,
         amount = $3,
         date = $4,
         title = $5,
         note = $6
       WHERE id = $7
       RETURNING *`,
      [userId, categoryId, amount, date, title, note || '', id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('DB error putExpensesById:', err);
    res.status(500).json({ message: 'Database error' });
  }
}

async function patchExpensesById(req, res) {
  const id = parseInt(req.params.id);

  const fields = [];
  const values = [];
  let counter = 1;

  for (const key in req.body) {
    fields.push(`${key} = $${counter}`);
    values.push(req.body[key]);
    counter++;
  }

  if (fields.length === 0) {
    return res.status(400).json({ message: 'Nothing to update' });
  }

  const query = `
    UPDATE expenses
    SET ${fields.join(', ')}
    WHERE id = $${counter}
    RETURNING *;
  `;

  values.push(id);

  try {
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('DB error patchExpensesById:', err);
    res.status(500).json({ message: 'Database error' });
  }
}

async function deleteExpensesById(req, res) {
  const id = parseInt(req.params.id);

  try {
    const result = await pool.query(
      'DELETE FROM expenses WHERE id = $1 RETURNING *',
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('DB error deleteExpensesById:', err);
    res.status(500).json({ message: 'Database error' });
  }
}

module.exports = {
  listExpenses,
  listExpensesById,
  createExpenses,
  putExpensesById,
  patchExpensesById,
  deleteExpensesById,
};
