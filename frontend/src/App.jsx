import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TaskDetailPage from './pages/TaskDetailPage';
import Navbar from './components/Navbar';
import './styles/App.css';

function App() {
  const [tasks, setTasks] = useState([]);

  // Fetch all tasks onLoad
  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch('/api');
      const data = await response.json();
      setTasks(data);
    };
    fetchTasks();
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Navbar tasks={tasks} setTasks={setTasks} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage setTasks={setTasks} />} />
            <Route path="/tasks/:taskId" element={<TaskDetailPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
