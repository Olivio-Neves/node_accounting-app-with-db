/* eslint-disable no-console */
'use strict';

const pool = require('../db');

async function getUsers(req, res) {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id ASC;');

    res.json(result.rows);
  } catch (err) {
    console.error('DB error getUsers:', err);
    res.status(500).json({ message: 'Database error' });
  }
}

async function getUsersById(req, res) {
  const id = parseInt(req.params.id);

  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1;', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('DB error getUsersById:', err);
    res.status(500).json({ message: 'Database error' });
  }
}

async function createUsers(req, res) {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Missing parameter' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *;`,
      [name, email],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('DB error createUsers:', err);

    if (err.code === '23505') {
      return res.status(400).json({ message: 'Email already exists' });
    }

    res.status(500).json({ message: 'Database error' });
  }
}

async function putUsersById(req, res) {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Missing parameter' });
  }

  try {
    const result = await pool.query(
      `UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *;`,
      [name, email, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('DB error putUsersById:', err);
    res.status(500).json({ message: 'Database error' });
  }
}

async function patchUsersById(req, res) {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users
       SET name = COALESCE($1, name),
           email = COALESCE($2, email)
       WHERE id = $3
       RETURNING *;`,
      [name, email, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('DB error patchUsersById:', err);
    res.status(500).json({ message: 'Database error' });
  }
}

async function deleteUsersById(req, res) {
  const id = parseInt(req.params.id);

  try {
    const result = await pool.query(
      `DELETE FROM users WHERE id = $1 RETURNING *;`,
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('DB error deleteUsersById:', err);
    res.status(500).json({ message: 'Database error' });
  }
}

module.exports = {
  getUsers,
  getUsersById,
  createUsers,
  putUsersById,
  patchUsersById,
  deleteUsersById,
};
