import { useState } from 'react'
import { useTask } from '../contexts/TaskContext'

export default function TaskItem({ task }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(task.title)
  const [editDescription, setEditDescription] = useState(task.description || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { updateTask, deleteTask, toggleTask } = useTask()

  const handleSaveEdit = async () => {
    if (!editTitle.trim()) {
      setError('El título no puede estar vacío')
      return
    }

    setLoading(true)
    setError('')

    try {
      await updateTask(task.id, editTitle, editDescription, task.completed)
      setIsEditing(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar')
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async () => {
    setLoading(true)
    setError('')

    try {
      await toggleTask(task.id)
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cambiar estado')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      setLoading(true)
      setError('')

      try {
        await deleteTask(task.id)
      } catch (err) {
        setError(err.response?.data?.message || 'Error al eliminar')
      } finally {
        setLoading(false)
      }
    }
  }

  if (isEditing) {
    return (
      <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-2 sm:px-3 py-1 sm:py-2 rounded mb-3 text-xs sm:text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            rows="2"
            className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
          ></textarea>

          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-2 sm:px-3 py-2 rounded font-semibold text-sm"
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={loading}
              className="flex-1 bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white px-2 sm:px-3 py-2 rounded font-semibold text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`p-3 sm:p-4 rounded-lg border-2 transition ${
        task.completed
          ? 'bg-gray-50 border-gray-200'
          : 'bg-white border-gray-300 hover:border-blue-400'
      }`}
    >
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-2 sm:px-3 py-1 sm:py-2 rounded mb-3 text-xs sm:text-sm">
          {error}
        </div>
      )}

      <div className="flex items-start gap-2 sm:gap-3">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={handleToggle}
          disabled={loading}
          className="w-4 h-4 sm:w-5 sm:h-5 mt-1 cursor-pointer accent-blue-600 shrink-0"
        />

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold text-sm sm:text-lg break-all ${
              task.completed
                ? 'line-through text-gray-500'
                : 'text-gray-800'
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p
              className={`text-xs sm:text-sm mt-1 break-all ${
                task.completed ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {task.description}
            </p>
          )}
          <div className="text-xs text-gray-400 mt-2">
            {new Date(task.created_at).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-1 sm:gap-2 shrink-0">
          <button
            onClick={() => setIsEditing(true)}
            disabled={loading}
            className="text-blue-600 hover:text-blue-800 font-semibold p-1 sm:p-2 disabled:text-gray-400 text-lg sm:text-xl"
            title="Editar"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="text-red-600 hover:text-red-800 font-semibold p-1 sm:p-2 disabled:text-gray-400 text-lg sm:text-xl"
            title="Eliminar"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}
