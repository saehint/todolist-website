import { NextResponse } from 'next/server';
import db from '../../lib/db';

export async function GET(req) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const tasks = db.prepare('SELECT * FROM todos WHERE user_id = ?').all(userId);
  return NextResponse.json(tasks);
}

export async function POST(req) {
  const { userId, task } = await req.json();
  if (!userId || !task || !task.trim()) {
    return NextResponse.json({ error: 'Cannot submit empty task' }, { status: 400 });
  }
  const stmt = db.prepare('INSERT INTO todos (user_id, task) VALUES (?, ?)');
  const res = stmt.run(userId, task.trim());
  return NextResponse.json({ id: res.lastInsertRowid, task, completed: 0 });
}

export async function DELETE(req) {
  const { userId, taskId } = await req.json();
  // ป้องกันการลบของ user อื่น
  const stmt = db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?');
  const res = stmt.run(taskId, userId);
  if (res.changes === 0) return NextResponse.json({ error: 'Unauthorized delete' }, { status: 403 });
  return NextResponse.json({ success: true });
}