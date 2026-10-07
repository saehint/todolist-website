'use client';
import { useState, useEffect } from 'react';

export default function Home() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tasks, setTasks] = useState([]);
  const [inputTask, setInputTask] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (endpoint) => {
    setError('');
    const res = await fetch(`/api/auth/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok) setUser(data);
    else setError(data.error);
  };

  const loadTasks = async () => {
    if (!user) return;
    const res = await fetch(`/api/todos?userId=${user.id}`);
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => { loadTasks(); }, [user]);

  const addTask = async () => {
    if (!inputTask.trim()) { setError('Task cannot be empty'); return; }
    setError('');
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, task: inputTask })
    });
    if (res.ok) { setInputTask(''); loadTasks(); }
    else { const d = await res.json(); setError(d.error); }
  };

  const deleteTask = async (taskId) => {
    await fetch('/api/todos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, taskId })
    });
    loadTasks();
  };

  if (!user) {
    return (
      <div style={{ maxWidth: 400, margin: 'auto', background: '#fff', padding: 20, borderRadius: 8 }}>
        <h2>Login / Register</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input style={{ display: 'block', width: '90%', marginBottom: 10, padding: 8 }} placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input style={{ display: 'block', width: '90%', marginBottom: 10, padding: 8 }} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button style={{ marginRight: 10, padding: '8px 16px' }} onClick={() => handleAuth('login')}>Login</button>
        <button style={{ padding: '8px 16px' }} onClick={() => handleAuth('register')}>Register</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 500, margin: 'auto', background: '#fff', padding: 20, borderRadius: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Logged in as: {user.username}</h3>
        <button onClick={() => setUser(null)}>Logout</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ display: 'flex', gap: 10, margin: '15px 0' }}>
        <input style={{ flex: 1, padding: 8 }} value={inputTask} onChange={e => setInputTask(e.target.value)} placeholder="New task..." />
        <button onClick={addTask}>Add</button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map(t => (
          <li key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee' }}>
            <span>{t.task}</span>
            <button onClick={() => deleteTask(t.id)} style={{ color: 'red' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}