import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
    host: process.env.DB_HOST || '203.171.240.118',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'project',
    password: process.env.DB_PASSWORD || 'Project@123',
    database: process.env.DB_NAME || 'FSD_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  export async function pingDatabase() {
    // Simple connectivity check used at startup
    const conn = await pool.getConnection();
    try {
      await conn.ping();
    } finally {
      conn.release();
    }
  }