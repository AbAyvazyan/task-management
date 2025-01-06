import styles from './style.module.scss';
import SearchIcon from '../../assets/icons/search.svg';
import { useTaskContext } from '../../contexts/TaskContext';
import { useState } from 'react';

const SearchBar = () => {
  const { searchTasks } = useTaskContext();
  const [searchInput, setSearchInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    searchTasks(value);
  };

  return (
    <div className={styles.searchWrapper}>
      <span className={styles.searchIcon}>
        <SearchIcon />
      </span>
      <input
        type="text"
        value={searchInput}
        onChange={handleChange}
        className={styles.searchBar}
        placeholder="поиск..."
      />
    </div>
  );
};

export default SearchBar;
