import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';
import path from 'path';

function getDb() {
  const dbPath = process.env.NODE_ENV === 'production' 
    ? path.join('/tmp', 'todo.db') 
    : path.join(process.cwd(), 'todo.db');
  const db = new Database(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, task TEXT NOT NULL, completed INTEGER DEFAULT 0);
  `);
  return db;
}

export async function POST(req) {
  const { username, password } = await req.json();
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }
  return NextResponse.json({ id: user.id, username: user.username });
}