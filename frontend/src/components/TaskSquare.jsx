import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function TaskSquare({ task, onDelete }) {
  return (
    <div className="task-square">
      <Link to={`/tasks/${task.task_id}`} className="task-link">
        {task.title}
      </Link>
      <button onClick={() => onDelete(task.task_id)} className="deleteBtn">x</button>
    </div>
  );
}

// Expected props
TaskSquare.propTypes = {
  task: PropTypes.shape({
    task_id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default TaskSquare;
