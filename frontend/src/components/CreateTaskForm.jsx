import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Get data from input fields for creating a task
function CreateTaskForm({ setTasks }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState(1);
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

// Creates a task when button is clicked
  const handleCreateTask = async () => { // Setup for backend
    const newTask = { title, category_id: parseInt(category), priority, description };
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask),
    });
    const data = await response.json();

    console.log("Response data:", data);

// If all went good (surely) navigate to task detailspage
    if (data && data.task_id) {
      setTasks((prevTasks) => [...prevTasks, data]);
      navigate(`/tasks/${data.task_id}`);
    } else {
      console.error("Failed to create task with valid task_id");
    }
  };
  return (
    <div className="createTaskForm">
      <h1 id="logo">nootANT.</h1>
      <input id="inputTitle" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task Title" />
      <div className="dropDownContainer">
      <select className="dropDown" value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select Category</option>
        <option value="1">School</option>
        <option value="2">Private</option>
        <option value="3">Grocery Shopping</option>
      </select>
      <select className="dropDown" value={priority} onChange={(e) => setPriority(parseInt(e.target.value))}>
        {[1, 2, 3, 4, 5].map(num => (
          <option key={num} value={num}>{num}</option>
        ))}
      </select>
      </div>
      <input id="inputDescription" type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description" />
      <button id="createTaskBtn" onClick={handleCreateTask}>Create Task</button>
    </div>
  );
}

CreateTaskForm.propTypes = {
  setTasks: PropTypes.func.isRequired,
};

export default CreateTaskForm;
