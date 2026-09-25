const express = require('express');
const mysql = require('mysql2/promise');
const os = require('os');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Health check — this is what the load balancer's target group hits
app.get('/', (req, res) => res.send('OK'));

// Confirms DB connectivity and shows which server handled the request
app.get('/test-insert', async (req, res) => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    await conn.execute(
      'CREATE TABLE IF NOT EXISTS test_table (id INT AUTO_INCREMENT PRIMARY KEY, message VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)'
    );
    await conn.execute('INSERT INTO test_table (message) VALUES (?)', [
      'Hello from ' + os.hostname(),
    ]);
    const [rows] = await conn.execute('SELECT * FROM test_table ORDER BY id DESC LIMIT 10');
    await conn.end();

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
