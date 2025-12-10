// src/services/api.ts
import { User } from '../types';
import { Category } from '../types';
import { Expense } from '../types';
export {};

const API_URL = 'http://localhost:5700';

export async function getUsers(): Promise<User[]> {
  const res = await fetch(`${API_URL}/users`);
  return res.json();
}

export async function createUser(user: Omit<User, 'id'>): Promise<User> {
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  return res.json();
}

export async function deleteUser(id: number): Promise<void> {
  await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/categories`);
  return res.json();
}

export async function createCategory(category: Omit<Category, 'id'>): Promise<Category> {
  const res = await fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category),
  });
  return res.json();
}

export async function deleteCategory(id: number): Promise<void> {
  await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE' });
}

export async function getExpenses(): Promise<Expense[]> {
  const res = await fetch(`${API_URL}/expenses`);
  return res.json();
}

export async function createExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
  const res = await fetch(`${API_URL}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense),
  });
  return res.json();
}

export async function deleteExpense(id: number): Promise<void> {
  await fetch(`${API_URL}/expenses/${id}`, { method: 'DELETE' });
}
