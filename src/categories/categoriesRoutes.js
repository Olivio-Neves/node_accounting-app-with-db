const express = require('express');
const router = express.Router();

const {
  listCategories,
  getCategoryById,
  createCategory,
  putCategory,
  patchCategory,
  deleteCategory,
} = require('./categoriesController');

router.get('/', listCategories);
router.get('/:id', getCategoryById);
router.post('/', createCategory);
router.put('/:id', putCategory);
router.patch('/:id', patchCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
