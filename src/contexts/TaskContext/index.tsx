import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import debounce from '@utils/debounce.ts';

export interface Task {
  id: number;
  type: 'todo' | 'in_progress' | 'review' | 'done';
  startDay: number;
  endDay: number;
  text: string;
}

interface TaskContextProps {
  tasks: Task[];
  filteredTasks: Task[];
  searchTasks: (query: string) => void;
  updateTask: (updatedTasks: Task[]) => void;
  updateSingleTask: (updatedTask: Task) => void;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

// Custom hook to use TaskContext
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

// Provider component
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  useEffect(() => {
    const loadTasks = async () => {
      const storedTasks = localStorage.getItem('tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
        setFilteredTasks(JSON.parse(storedTasks));
      } else {
        try {
          const response = await fetch('../../../tasks.json');
          const data: Task[] = await response.json();
          setTasks(data);
          setFilteredTasks(data);
        } catch (error) {
          console.error('Error loading tasks:', error);
        }
      }
    };
    loadTasks();
  }, []);

  // Persist tasks to localStorage whenever they change
  useEffect(() => {
    if (!tasks.length) return;
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const updateTask = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  };

  const updateSingleTask = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );
    setFilteredTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );
  };

  // Debounced search functionality
  const searchTasks = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        const response = await fetch('../../../tasks.json');
        setFilteredTasks(await response.json());
        return;
      }

      const searchLower = query.toLowerCase();

      const isDate = /^\d{2}\.\d{2}\.\d{4}$/.test(query);
      setFilteredTasks(
        tasks.filter((task) => {
          if (isDate) {
            const startDate = new Date(task.startDay).toLocaleDateString('en-GB');
            const endDate = new Date(task.endDay).toLocaleDateString('en-GB');
            return startDate === query || endDate === query;
          }
          return task.text.toLowerCase().includes(searchLower);
        }),
      );
    }, 300),
    [tasks],
  );

  return (
    <TaskContext.Provider
      value={{ tasks, filteredTasks, searchTasks, updateTask, setTasks, updateSingleTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};
