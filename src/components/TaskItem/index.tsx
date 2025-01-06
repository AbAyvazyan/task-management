import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from './style.module.scss';
import { Columns } from '@layouts/TaskBoard';

import SVGEdit from '@assets/icons/edit.svg';
import SVGClose from '@assets/icons/cross.svg';
import SVGAccept from '@assets/icons/check.svg';
import InputField from '@components/InputField';
import { useTaskContext } from '../../contexts/TaskContext';

type Task = {
  id: number;
  type: 'todo' | 'in_progress' | 'review' | 'done';
  startDay: number;
  endDay: number;
  text: string;
};

type TaskItemProps = {
  task: Task;
  provided: any;
  columns: { [key: string]: Task[] };
  setColumns: Dispatch<SetStateAction<Columns>>;
};

const TaskItem = ({ task, provided, setColumns }: TaskItemProps) => {
  const { updateSingleTask } = useTaskContext();
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [newTask, setNewTask] = useState<Task>({
    ...task, // Initialize with task values
  });

  useEffect(() => {
    if (newTask) return;

    updateSingleTask(newTask);
  }, [newTask]);

  // Start editing a task
  const handleEditTask = () => {
    setEditTaskId(task.id);
  };

  const handleCancelChange = () => {
    setEditTaskId(null);
  };

  // Save the edited task
  const handleSaveTask = () => {
    setColumns((prevColumns) => {
      const updatedColumns = { ...prevColumns };

      // Update the task in each column
      Object.keys(updatedColumns).forEach((columnId) => {
        updatedColumns[columnId as keyof typeof updatedColumns] = updatedColumns[
          columnId as keyof typeof updatedColumns
        ].map((t) => {
          if (t.id === task.id) {
            // Update task with the new values
            t.text = newTask.text;
            t.startDay = newTask.startDay;
            t.endDay = newTask.endDay;
          }
          return t;
        });
      });

      return updatedColumns;
    });

    setEditTaskId(null); // Exit edit mode
  };

  // Handle change in task fields during edit
  const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Task) => {
    const value = field === 'text' ? e.target.value : parseInt(e.target.value, 10);
    setNewTask((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={styles.taskItem}
    >
      {editTaskId === task.id ? (
        <div className={styles.editTask}>
          <div>
            <span className={styles.taskItemField}>Начало:</span>
            <InputField
              type="number"
              value={newTask.startDay}
              onChange={(e) => handleTaskChange(e, 'startDay')}
              placeholder="Start Day"
            />
          </div>
          <div>
            <span className={styles.taskItemField}>Окончание:</span>
            <InputField
              type="number"
              value={newTask.endDay}
              onChange={(e) => handleTaskChange(e, 'endDay')}
              placeholder="End Day"
            />
          </div>
          <div>
            <span className={styles.taskItemField}>Описание:</span>
            <InputField
              type="text"
              value={newTask.text}
              onChange={(e) => handleTaskChange(e, 'text')}
              placeholder="Task Title"
            />
          </div>
          <div className={styles.buttonGroup}>
            <button className={styles.actionButton} onClick={handleCancelChange}>
              <SVGClose />
            </button>
            <button className={styles.actionButton} onClick={handleSaveTask}>
              <SVGAccept />
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.taskContent}>
          <div>
            <span className={styles.taskItemField}>Начало:</span>:
            <span className={styles.taskItemFieldValue}>{task.startDay}</span>
          </div>
          <div>
            <span className={styles.taskItemField}>Окончание:</span>:
            <span className={styles.taskItemFieldValue}>{task.endDay}</span>
          </div>
          <div>
            <span className={styles.taskItemField}>Описание:</span>:
            <span className={styles.taskItemFieldValue}>{task.text}</span>
          </div>
          {task.type === 'todo' ? (
            <button className={styles.editButton} onClick={handleEditTask}>
              <SVGEdit />
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default TaskItem;
