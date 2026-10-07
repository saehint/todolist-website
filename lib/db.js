import Database from 'better-sqlite3';
import path from 'path';

// ใช้ /tmp สำหรับ Vercel Serverless environment
const dbPath = process.env.NODE_ENV === 'production' 
  ? path.join('/tmp', 'todo.db') 
  : path.join(process.cwd(), 'todo.db');

const db = new Database(dbPath);

// สร้างตาราง users และ todos พร้อม hash password
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    task TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

export default db;