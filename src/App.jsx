import React, { useState, useEffect } from 'react';
import './App.css';

const STORAGE_KEY = 'react-todo-list.tasks';

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [newTask, setNewTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e) => {
    e.preventDefault();

    if (newTask.trim() === '') {
      return;
    }

    const task = {
      id: Date.now(),
      text: newTask,
      completed: false,
    };

    setTasks([...tasks, task]);
    setNewTask('');
  };

  const handleRemoveTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleToggleCompleted = (taskId) => {
    setTasks(
      tasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleEditTask = (taskId) => {
    const taskToEdit = tasks.find(task => task.id === taskId);
    setEditingTaskId(taskId);
    setEditingText(taskToEdit.text);
  };

  const handleSaveEdit = (taskId) => {
    if (editingText.trim() === '') {
      handleRemoveTask(taskId);
      return;
    }

    setTasks(
      tasks.map(task => 
        task.id === taskId ? { ...task, text: editingText } : task
      )
    );
    setEditingTaskId(null);
    setEditingText('');
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingText('');
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') {
      return task.completed;
    } else if (filter === 'active') {
      return !task.completed;
    }
    return true;
  });

  // Novo: contador de tarefas pendentes
  const pendingTasksCount = tasks.filter(task => !task.completed).length;

  return (
    <div className="App">
      <h1>Lista de Tarefas</h1>
      <form onSubmit={handleAddTask}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Adicionar nova tarefa..."
        />
        <button type="submit">Adicionar</button>
      </form>

      <div className="filter-buttons">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>Todas</button>
        <button onClick={() => setFilter('active')} className={filter === 'active' ? 'active' : ''}>Ativas</button>
        <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>Concluídas</button>
      </div>

      {/* Novo: exibe o contador */}
      <div className="task-count">
        <p>{pendingTasksCount} tarefa(s) pendente(s)</p>
      </div>

      <ul>
        {filteredTasks.map(task => (
          <li key={task.id}>
            {editingTaskId === task.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <button onClick={() => handleSaveEdit(task.id)}>Salvar</button>
                <button onClick={handleCancelEdit}>Cancelar</button>
              </div>
            ) : (
              <>
                <span
                  style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                  onClick={() => handleToggleCompleted(task.id)}
                >
                  {task.text}
                </span>
                <div className="task-controls">
                  <button onClick={() => handleEditTask(task.id)}>Editar</button>
                  <button onClick={() => handleRemoveTask(task.id)}>Remover</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;