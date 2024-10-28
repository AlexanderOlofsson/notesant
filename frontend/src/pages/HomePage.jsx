import PropTypes from 'prop-types';
import CreateTaskForm from '../components/CreateTaskForm';
import '../styles/HomePage.css';

function HomePage({ setTasks }) {
  return (
    <div className="home-page">
      <CreateTaskForm setTasks={setTasks} />
    </div>
  );
}

HomePage.propTypes = {
  setTasks: PropTypes.func.isRequired,
};

export default HomePage;
