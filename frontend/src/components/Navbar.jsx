import { useState } from 'react';
import PropTypes from 'prop-types';
import TaskList from './TaskList';
import '../styles/Navbar.css';

// State and toggle for navbar
function Navbar({ tasks, setTasks }) {
  const [isOpen, setIsOpen] = useState(true);


  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`navbar ${isOpen ? 'open' : 'collapsed'}`}>
      <button onClick={toggleNavbar} className="toggle-btn">
        {isOpen ? '«' : '»'}
      </button>
      {isOpen && (
        <div className="navbar-content">
          <TaskList tasks={tasks} setTasks={setTasks} />
        </div>
      )}
    </div>
  );
}


// Expected props
Navbar.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      task_id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      priority: PropTypes.number,
      category_name: PropTypes.string,
    })
  ).isRequired,
  setTasks: PropTypes.func.isRequired,
};

export default Navbar;
