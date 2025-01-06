import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.scss';
import { TaskProvider } from './contexts/TaskContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TaskProvider>
      <App />
    </TaskProvider>
  </React.StrictMode>,
);
