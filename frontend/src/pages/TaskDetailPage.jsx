import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function TaskDetailPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  // Fetch task and notes and If state to check if task exists/redirect back to homepage
  useEffect(() => {
    const fetchData = async () => {
      try {
        const taskRes = await fetch(`/api/tasks/${taskId}`);
        if (!taskRes.ok) {
          throw new Error('Task missing');
        }
        const data = await taskRes.json();

        // Please work
        if (!data.task) {
          navigate('/');
          return;
        }

        setTask(data.task);
        setNotes(data.notes);

      } catch (error) {
        console.error('Task missing:', error);
        navigate('/');
      }
    };
    fetchData();
  }, [taskId, navigate]);

  // Create a new note
  const addNote = async () => {
    try {
      const res = await fetch(`/api/tasks/${taskId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: newNote }),
      });
      if (!res.ok) {
        throw new Error('Failed to create note');
      }
      const data = await res.json();
      setNotes([...notes, data]);
      setNewNote('');
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  // Update note
  const updateNote = async (noteId, updatedNote) => {
    try {
      const res = await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: updatedNote }),
      });
      const data = await res.json();
      setNotes(notes.map(note => (note.id === noteId ? data : note)));
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  // Delete note
  const deleteNote = async (noteId) => {
    try {
      await fetch(`/api/notes/${noteId}`, { method: 'DELETE' });
      setNotes(notes.filter(note => note.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div>
      {task && (
        <div>
          <div className="taskContainer">
            <h1 className="notesTitle">{task.title}</h1>
            <p className="notesDescription">{task.description}</p>
            <div className="noteInputContainer">
              <input
                className="noteInput"
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Debugg, time etc"
              />
              <button className="noteBtn" onClick={addNote}>+</button>
            </div>
          </div>
          {notes.map((note) => (
       <div key={note.id} className="noteInputContainer">
          <input
            className="noteInput"
            type="text"
            value={note.note}
            onChange={(e) => updateNote(note.id, e.target.value)}
          />
      <button
        className="noteDeleteBtn"
        onClick={() => deleteNote(note.id)}>
      x
      </button>
  </div>
))}
        </div>
      )}
      <button className="backBtn" onClick={() => navigate('/')}>← Back</button>
    </div>
  );
}

export default TaskDetailPage;
