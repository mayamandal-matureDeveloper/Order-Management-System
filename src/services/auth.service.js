import { pool } from '../config/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export async function signup({ username, email, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await pool.query(
    `INSERT INTO 073_user (username, email, password)
     VALUES (?, ?, ?)`,
    [username, email, hashedPassword]
  );

  return { user_id: result.insertId, username, email };
}

export async function login({ email, password }) {
  const [rows] = await pool.query(
    `SELECT * FROM 073_user WHERE email = ?`,
    [email]
  );

  if (rows.length === 0) throw new Error('User not found');

  const user = rows[0];

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Invalid password');

  const token = jwt.sign(
    { user_id: user.user_id, email: user.email },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return { token };
}