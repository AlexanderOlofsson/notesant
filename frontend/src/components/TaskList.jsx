import { useState } from 'react';
import PropTypes from 'prop-types';
import TaskSquare from './TaskSquare';

function TaskList({ tasks, setTasks }) {
  const [searchQuery, setSearchQuery] = useState(''); // Search state
  const [filter, setFilter] = useState('');

  const handleSearch = (e) => { // This handles change in search input
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => { // Handles filter change
    setFilter(e.target.value);
  };

  // Delete task from server and also update the list
  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTasks((prevTasks) => prevTasks.filter((task) => task.task_id !== taskId));
      } else {
        console.error('Failed to delete task from database');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Filter and sort the tasks based on search and selected filter
  // This is real magic
  const filteredTasks = tasks
    .filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (filter === 'createdFirst') return new Date(b.created) - new Date(a.created);
      if (filter === 'createdLast') return new Date(a.created) - new Date(b.created);
      if (filter === 'alphabeticalAZ') return a.title.localeCompare(b.title);
      if (filter === 'alphabeticalZA') return b.title.localeCompare(a.title);
      if (filter === 'priority') return a.priority - b.priority;
      if (filter === 'categoryAZ') return a.category_name.localeCompare(b.category_name);
      if (filter === 'categoryZA') return b.category_name.localeCompare(a.category_name);
      return 0;
    });

  return (
    <div>
      <div className="search-filter">
        <input className="searchInput" type="text" placeholder="Search tasks" value={searchQuery} onChange={handleSearch} />
        <select className="dropDownSorting" value={filter} onChange={handleFilterChange}>
          <option>Sort by ↕️ </option>
          <option value="createdFirst">Newest</option>
          <option value="createdLast">Oldest</option>
          <option value="alphabeticalAZ">Alphabetical A-Z</option>
          <option value="alphabeticalZA">Alphabetical Z-A</option>
          <option value="priority">Priority</option>
          <option value="categoryAZ">Category A-Z</option>
          <option value="categoryZA">Category Z-A</option>
        </select>
      </div>
      <div className="task-grid">
        {filteredTasks.map((task, index) => (
          <TaskSquare key={task.task_id || index} task={task} onDelete={handleDeleteTask} />
        ))}
      </div>
    </div>
  );
}


// Expected props
TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      task_id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      priority: PropTypes.number,
      category: PropTypes.string,
    })
  ).isRequired,
  setTasks: PropTypes.func.isRequired,
};

export default TaskList;
