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
    CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT LOGGED UNIQUE NOT NULL, password TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, task TEXT NOT NULL, completed INTEGER DEFAULT 0);
  `);
  return db;
}

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    const hashedPassword = await bcrypt.hash(password, 10);
    const db = getDb();
    const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    const result = stmt.run(username, hashedPassword);
    return NextResponse.json({ id: result.lastInsertRowid, username });
  } catch (err) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }
}