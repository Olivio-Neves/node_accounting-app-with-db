import { useEffect, useState } from 'react';
import { getCategories, createCategory, deleteCategory } from '../services/api';
import { Category, CategoriesProps } from '../types';
import '../styles/categories.css'

export default function Categories({ onChange }: CategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const data = await getCategories();
    setCategories(data);
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;
    await createCategory({ name });
    setName('');
    fetchCategories();
    onChange?.();
  }

  async function handleDeleteCategory(id: number) {
    await deleteCategory(id);
    fetchCategories();
    onChange?.();
  }

  return (
    <div className="categories-container">
      <h2>Categories</h2>
      <form onSubmit={handleAddCategory}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Category Name"
          required
        />
        <button type="submit">Add Category</button>
      </form>

      <ul>
        {categories.map(c => (
          <li key={c.id}>
            {c.name}
            <button onClick={() => handleDeleteCategory(c.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
