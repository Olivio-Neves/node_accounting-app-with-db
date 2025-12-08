'use strict';

const express = require('express');
const router = express.Router();

const {
  getUsers,
  getUsersById,
  createUsers,
  putUsersById,
  patchUsersById,
  deleteUsersById,
} = require('./usersController');

router.get('/', getUsers);
router.get('/:id', getUsersById);
router.post('/', createUsers);
router.put('/:id', putUsersById);
router.patch('/:id', patchUsersById);
router.delete('/:id', deleteUsersById);

module.exports = router;
