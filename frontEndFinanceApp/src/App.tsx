import React, { useState, useEffect } from 'react';
import Users from './components/Users';
import Categories from './components/Categories';
import Expenses from './components/Expenses';
import { User, Category } from './types';
import { getCategories, getUsers } from './services/api';

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  async function fetchData() {
    setUsers(await getUsers());
    setCategories(await getCategories());
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Finance App</h1>

      <Users onChange={fetchData} />
      <Categories onChange={fetchData} />

      <Expenses users={users} categories={categories} />
    </div>
  );
}

export default App;
