import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import styles from './style.module.scss';

import SVGSMile from '@assets/icons/bxs_smile.svg';
import SVGSHappy from '@assets/icons/bxs_happy-alt.svg';
import SVGSDown from '@assets/icons/bxs_upside-down.svg';
import SVGSGhost from '@assets/icons/bxs_ghost.svg';
import SVGSTrash from '@assets/icons/trash.svg';
import TaskItem from '@components/TaskItem';
import { useTaskContext } from '../../contexts/TaskContext';

type Task = {
  id: number;
  type: 'todo' | 'in_progress' | 'review' | 'done';
  startDay: number;
  endDay: number;
  text: string;
};

export type Columns = {
  todo: Task[];
  'in-progress': Task[];
  review: Task[];
  done: Task[];
};

const statusColumnNames = ['todo', 'in-progress', 'review', 'done'];

const icons: { [key: string]: React.ReactNode } = {
  todo: <SVGSMile />,
  'in-progress': <SVGSHappy />,
  review: <SVGSDown />,
  done: <SVGSGhost />,
};

const TaskBoard = ({ initialTasks }: { initialTasks: Task[] }) => {
  const { updateTask } = useTaskContext();
  const [columns, setColumns] = useState<Columns>({
    todo: [],
    'in-progress': [],
    review: [],
    done: [],
  });

  useEffect(() => {
    if (
      columns.todo.length > 0 ||
      columns['in-progress'].length > 0 ||
      columns.review.length > 0 ||
      columns.done.length > 0
    ) {
      updateTask([...columns.todo, ...columns['in-progress'], ...columns.review, ...columns.done]);
    }
  }, [columns]);

  useEffect(() => {
    setColumns({
      todo: initialTasks.filter((task) => task.type === 'todo'),
      'in-progress': initialTasks.filter((task) => task.type === 'in_progress'),
      review: initialTasks.filter((task) => task.type === 'review'),
      done: initialTasks.filter((task) => task.type === 'done'),
    });
  }, [initialTasks.toString()]);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (
      !destination ||
      (destination.droppableId === source.droppableId && destination.index === source.index)
    )
      return;

    const updatedColumns = { ...columns };
    const sourceColumn = updatedColumns[source.droppableId as keyof Columns];
    const destinationColumn = updatedColumns[destination.droppableId as keyof Columns];

    const [movedTask] = sourceColumn.splice(source.index, 1);

    movedTask.type = destination.droppableId as 'todo' | 'in_progress' | 'review' | 'done';

    destinationColumn.splice(destination.index, 0, movedTask);
    setColumns(updatedColumns);
  };

  const handleAddTask = () => {
    const newTask: Task = {
      id: Date.now(),
      text: 'New Task',
      type: 'todo',
      startDay: Date.now(),
      endDay: 0,
    };

    setColumns((prevColumns) => ({
      ...prevColumns,
      todo: [...prevColumns.todo, newTask],
    }));
  };

  const handleClearDoneTasks = () => {
    setColumns((prevColumns) => ({
      ...prevColumns,
      done: [],
    }));
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={styles.taskBoard}>
        {statusColumnNames.map((columnId) => (
          <Droppable droppableId={columnId} key={columnId}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={styles.taskColumn}
              >
                <div className={styles.columnHeader}>
                  <div className={styles.iconAndTitle}>
                    {icons[columnId]}
                    <h2>{columnId.charAt(0).toUpperCase() + columnId.slice(1)}</h2>
                  </div>
                  {columnId === 'todo' && (
                    <div className={styles.addTask} onClick={handleAddTask}>
                      + Добавить
                    </div>
                  )}
                  {columnId === 'done' && (
                    <div className={styles.addTask} onClick={handleClearDoneTasks}>
                      <SVGSTrash />
                    </div>
                  )}
                </div>

                {columns[columnId as keyof Columns].map((task, index) => (
                  <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                    {(provided) => (
                      <TaskItem
                        task={task}
                        provided={provided}
                        columns={columns}
                        setColumns={setColumns}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;
