const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let connection;

app.post('/connect', async (req, res) => {
  const { host, user, password } = req.body;
  try {
    connection = await mysql.createConnection({ host, user, password });
    const [databases] = await connection.query('SHOW DATABASES');
    res.json(databases.map(db => db.Database));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/getTables', async (req, res) => {
  const { db } = req.body;
  try {
    await connection.query(`USE \`${db}\``);
    const [tables] = await connection.query('SHOW TABLES');
    res.json(tables.map(t => Object.values(t)[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/describe', async (req, res) => {
  const { table } = req.body;
  try {
    const [desc] = await connection.query(`DESCRIBE \`${table}\``);
    res.json(desc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/getData', async (req, res) => {
  const { table } = req.body;
  try {
    const [rows] = await connection.query(`SELECT * FROM \`${table}\` LIMIT 100`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log('Server running on http://localhost:3001'));
