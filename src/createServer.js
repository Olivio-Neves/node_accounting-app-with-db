'use strict';

const express = require('express');
const cors = require('cors');

function createServer() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  const usersRoutes = require('./users/usersRoutes');
  const expensesRoutes = require('./expenses/expensesRoutes');
  const categoriesRoutes = require('./categories/categoriesRoutes');

  app.use('/expenses', (req, res, next) => {
    req.expenses = app.locals.expenses;
    req.expenseIdCounter = app.locals.expenseIdCounter;
    req.users = app.locals.users;
    next();
  });

  app.use('/categories', categoriesRoutes);
  app.use('/users', usersRoutes);
  app.use('/expenses', expensesRoutes);

  app.get('/', (req, res) => {
    res.send('Server is running');
  });

  return app;
}

module.exports = { createServer };
