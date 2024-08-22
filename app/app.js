const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = 3000;

const config = {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'root',
    database: process.env.MYSQL_DATABASE || 'testdb'
};

app.get('/health', (req, res) => {
    res.send('OK');
});

app.get('/', async (req, res) => {
    const connection = await mysql.createConnection(config);
    await connection.query('CREATE TABLE IF NOT EXISTS people (name VARCHAR(255))');
    await connection.query(`INSERT INTO people(name) values('Erick Zanetti')`);
    const [rows] = await connection.query('SELECT name FROM people');
    connection.end();

    let response = '<h1>Full Cycle Rocks!</h1><ul>';
    rows.forEach(row => {
        response += `<li>${row.name}</li>`;
    });
    response += '</ul>';

    res.send(response);
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});

