import SearchBar from '@components/SearchBar';
import styles from './styles.module.scss';
import TaskBoard from '@layouts/TaskBoard';
import { useTaskContext } from '../../contexts/TaskContext';

const HomePage = () => {
  const { filteredTasks } = useTaskContext();
  return (
    <section>
      <div className={styles.headingPart}>
        <h1>Your tasks</h1>
        <SearchBar />
      </div>

      <TaskBoard initialTasks={filteredTasks} />
    </section>
  );
};

export default HomePage;
