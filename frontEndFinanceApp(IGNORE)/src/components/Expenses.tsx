import { useEffect, useState } from 'react';
import { getExpenses, createExpense, deleteExpense } from '../services/api';
import { Expense, ExpensesProps } from '../types';
import '../styles/expenses.css';

export default function Expenses({ users, categories }: ExpensesProps) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState<number | ''>('');
  const [userId, setUserId] = useState<number | ''>('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [spentAt, setSpentAt] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, []);

  async function fetchExpenses() {
    setExpenses(await getExpenses());
  }

  async function handleAddExpense(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !amount || !userId || !categoryId || !spentAt) return;

    await createExpense({
      title,
      amount: Number(amount),
      userId: Number(userId),
      categoryId: Number(categoryId),
      date: spentAt,
      note: '',
    });

    setTitle('');
    setAmount('');
    setUserId('');
    setCategoryId('');
    setSpentAt('');

    fetchExpenses();
  }

  async function handleDeleteExpense(id: number) {
    await deleteExpense(id);
    fetchExpenses();
  }

  return (
    <div className="expenses-container">
      <h2>Expenses</h2>
      <form onSubmit={handleAddExpense}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <input
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          placeholder="Amount"
          type="number"
          required
        />
        <select value={userId} onChange={e => setUserId(Number(e.target.value))} required>
          <option value="">Select User</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
        <select value={categoryId} onChange={e => setCategoryId(Number(e.target.value))} required>
          <option value="">Select Category</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input
          type="datetime-local"
          value={spentAt}
          onChange={e => setSpentAt(e.target.value)}
          required
        />
        <button type="submit">Add Expense</button>
      </form>

      <ul>
        {expenses.map(e => (
          <li key={e.id}>
            {e.title} - comprado em: {e.date}
            <button onClick={() => handleDeleteExpense(e.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
