import { useEffect, useState } from 'react';
import { getUsers, createUser, deleteUser } from '../services/api';
import { User, UsersProps } from '../types';
import '../styles/users.css'
export {};


export default function Users({ onChange }: UsersProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const data = await getUsers();
    setUsers(data);
  }

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) return;
    await createUser({ name, email });
    setName('');
    setEmail('');
    fetchUsers();
    onChange?.();
  }

  async function handleDeleteUser(id: number) {
    await deleteUser(id);
    fetchUsers();
    onChange?.();
  }

  return (
    <div className="users-container">
      <h2>Users</h2>
      <form onSubmit={handleAddUser}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <button type="submit">Add User</button>
      </form>

      <ul>
        {users.map(u => (
          <li key={u.id}>
            {u.name} ({u.email}) 
            <button onClick={() => handleDeleteUser(u.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}