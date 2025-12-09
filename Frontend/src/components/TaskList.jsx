import { useEffect, useState } from 'react'
import { useTask } from '../contexts/TaskContext'
import TaskItem from './TaskItem'

export default function TaskList() {
  const { tasks, stats, loading, error, fetchTasks } = useTask()
  const [filter, setFilter] = useState('all') // all, completed, pending

  useEffect(() => {
    fetchTasks()
  }, [])

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed
    if (filter === 'pending') return !task.completed
    return true
  })

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-gray-600 font-semibold text-sm sm:text-base">Total de Tareas</div>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-gray-600 font-semibold text-sm sm:text-base">Completadas</div>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-orange-600">{stats.pending}</div>
            <div className="text-gray-600 font-semibold text-sm sm:text-base">Pendientes</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 sm:px-4 py-2 rounded font-semibold transition text-xs sm:text-sm ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Todas ({stats.total})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 sm:px-4 py-2 rounded font-semibold transition text-xs sm:text-sm ${
              filter === 'pending'
                ? 'bg-orange-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Pendientes ({stats.pending})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 sm:px-4 py-2 rounded font-semibold transition text-xs sm:text-sm ${
              filter === 'completed'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Completadas ({stats.completed})
          </button>
        </div>
      </div>

      {/* Errores */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded text-sm sm:text-base">
          {error}
        </div>
      )}

      {/* Estado de carga */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Cargando tareas...</p>
        </div>
      )}

      {/* Lista de tareas */}
      {!loading && filteredTasks.length === 0 ? (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow text-center">
          <div className="text-3xl sm:text-4xl mb-2">📭</div>
          <p className="text-gray-600 text-base sm:text-lg font-semibold">
            {filter === 'all'
              ? 'No tienes tareas'
              : filter === 'completed'
              ? 'No hay tareas completadas'
              : 'No hay tareas pendientes'}
          </p>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            {filter === 'all' && '¡Crea una nueva tarea para comenzar!'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  )
}
