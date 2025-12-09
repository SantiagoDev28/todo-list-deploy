import { createContext, useContext, useState, useCallback } from 'react';
import { taskService } from '../services/api';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener todas las tareas
  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);
      const response = await taskService.getAllTasks();
      setTasks(response.data.tasks);
      setStats(response.data.stats);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to fetch tasks';
      setError(errorMsg);
      console.error('Fetch tasks error:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Crear tarea
  const createTask = async (title, description = '') => {
    try {
      setError(null);
      const response = await taskService.createTask(title, description);
      setTasks([response.data.task, ...tasks]);
      setStats({
        ...stats,
        total: stats.total + 1,
      });
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create task';
      setError(errorMsg);
      throw err;
    }
  };

  // Actualizar tarea
  const updateTask = async (taskId, title, description, completed) => {
    try {
      setError(null);
      const response = await taskService.updateTask(taskId, title, description, completed);
      
      const updatedTasks = tasks.map(task =>
        task.id === taskId ? response.data.task : task
      );
      setTasks(updatedTasks);
      
      // Recalcular estadísticas
      const completedCount = updatedTasks.filter(t => t.completed).length;
      setStats({
        total: updatedTasks.length,
        completed: completedCount,
        pending: updatedTasks.length - completedCount,
      });
      
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to update task';
      setError(errorMsg);
      throw err;
    }
  };

  // Eliminar tarea
  const deleteTask = async (taskId) => {
    try {
      setError(null);
      await taskService.deleteTask(taskId);
      
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      
      // Recalcular estadísticas
      const completedCount = updatedTasks.filter(t => t.completed).length;
      setStats({
        total: updatedTasks.length,
        completed: completedCount,
        pending: updatedTasks.length - completedCount,
      });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to delete task';
      setError(errorMsg);
      throw err;
    }
  };

  // Cambiar estado de tarea
  const toggleTask = async (taskId) => {
    try {
      setError(null);
      const response = await taskService.toggleTask(taskId);
      
      const updatedTasks = tasks.map(task =>
        task.id === taskId ? response.data.task : task
      );
      setTasks(updatedTasks);
      
      // Recalcular estadísticas
      const completedCount = updatedTasks.filter(t => t.completed).length;
      setStats({
        total: updatedTasks.length,
        completed: completedCount,
        pending: updatedTasks.length - completedCount,
      });
      
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to toggle task';
      setError(errorMsg);
      throw err;
    }
  };

  const value = {
    tasks,
    stats,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTask,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
