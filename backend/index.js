const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const { Client } = require('pg');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const client = new Client({
  connectionString: process.env.PGURI,
});
client.connect();

// ----------------------------------------------------------------------
// ** Task endpoints
//-----------------------------------------------------------------------

// Get all tasks with categories (VIEW)
app.get('/api', async (_req, res) => {
  try {
    const { rows } = await client.query('SELECT * FROM public."tasks with categories"');
    res.json(rows);
  } catch (err) {
    console.error("Couldn't fetch tasks:", err);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Create a new task
app.post('/api/tasks', async (req, res) => {
  const { title, category_id, priority, description } = req.body;
  try {
    const result = await client.query(
      'INSERT INTO tasks (title, category_id, priority, description) VALUES ($1, $2, $3, $4) RETURNING id AS task_id, title, description, category_id, priority, created',
      [title, category_id, priority, description]
    );
    res.status(201).json(result.rows[0]); // // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204 i guess?
  } catch (error) {
    console.error("Couldn't create task:", error);
    res.status(500).json({ message: 'Error creating task' });
  }
});

// Delete a task and its notes
app.delete('/api/tasks/:taskId', async (req, res) => {
  const { taskId } = req.params;
  try {
    await client.query('DELETE FROM task_notes WHERE task_id = $1', [taskId]); // Delete notes before task (because FK)
    await client.query('DELETE FROM tasks WHERE id = $1', [taskId]);
    // Delete task
    res.status(204).end();
  } catch (err) {
    console.error("Error deleting:", err);
    res.status(500).json({ message: 'Error deleting task and notes' });
  }
});



// Get a single task with its notes
app.get('/api/tasks/:taskId', async (req, res) => {
  const { taskId } = req.params;
  try {
    const task = await client.query(
      'SELECT * FROM public."tasks with categories" WHERE task_id = $1',
      [taskId]
    );
    const notes = await client.query(
      'SELECT * FROM task_notes WHERE task_id = $1',
      [taskId]
    );
    res.json({ task: task.rows[0], notes: notes.rows });
  } catch (err) {
    console.error("Couldn't fetch task and notes:", err);
    res.status(500).json({ message: 'Error fetching task and notes' });
  }
});

// ----------------------------------------------------------------------
// ** Notes endpoints
//-----------------------------------------------------------------------

// Create a new note for a task
app.post('/api/tasks/:taskId/notes', async (req, res) => {
  const { taskId } = req.params;
  const { note } = req.body;

  try {
    const result = await client.query(
      'INSERT INTO task_notes (task_id, note) VALUES ($1, $2) RETURNING *',
      [taskId, note]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error creating note' });
  }
});

// Update a note
app.put('/api/notes/:noteId', async (req, res) => {
  const { noteId } = req.params;
  const { note } = req.body;
  try {
    const result = await client.query(
      'UPDATE task_notes SET note = $1 WHERE id = $2 RETURNING *',
      [note, noteId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Couldn't update note:", err);
    res.status(500).json({ message: 'Error updating note' });
  }
});

// Delete a note
app.delete('/api/notes/:noteId', async (req, res) => {
  const { noteId } = req.params;
  try {
    await client.query('DELETE FROM task_notes WHERE id = $1', [noteId]);
    res.status(204).end(); // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204 i guess?
  } catch (err) {
    console.error("Couldn't delete note:", err);
    res.status(500).json({ message: 'Error deleting note' });
  }
});

// Frontend dist folder
app.use(express.static(path.join(__dirname, 'dist')));

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
