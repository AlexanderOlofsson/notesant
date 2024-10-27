const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const { Client } = require('pg');

dotenv.config();

const app = express();
app.use(cors());

const client = new Client({
  connectionString: process.env.PGURI
});

client.connect();

app.get('/api', async (_request, response) => {
  const { rows } = await client.query(
    'SELECT * FROM public."tasks with categories"'
  );

  response.send(rows);
});

app.use(express.static(path.join(path.resolve(), 'dist')));

app.listen(3000, () => {
  console.log('Redo på http://localhost:3000/');
});
