/* eslint-disable no-console */
const pool = require('../db');

async function listCategories(req, res) {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY id ASC');

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
}

async function getCategoryById(req, res) {
  const id = parseInt(req.params.id);

  try {
    const result = await pool.query('SELECT * FROM categories WHERE id = $1', [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Database error' });
  }
}

async function createCategory(req, res) {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Missing parameter' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [name],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Database error' });
  }
}

async function putCategory(req, res) {
  const id = parseInt(req.params.id);
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Missing parameter' });
  }

  try {
    const result = await pool.query(
      'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *',
      [name, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Database error' });
  }
}

async function patchCategory(req, res) {
  const id = parseInt(req.params.id);
  const { name } = req.body;

  try {
    const result = await pool.query(
      `UPDATE categories
     SET name = COALESCE($1, name)
     WHERE id = $2
     RETURNING *`,
      [name, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Database error' });
  }
}

async function deleteCategory(req, res) {
  const id = parseInt(req.params.id);

  try {
    const result = await pool.query(
      'DELETE FROM categories WHERE id = $1 RETURNING *',
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Database error' });
  }
}

module.exports = {
  listCategories,
  getCategoryById,
  createCategory,
  putCategory,
  patchCategory,
  deleteCategory,
};
