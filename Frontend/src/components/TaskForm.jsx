import { useState } from 'react'
import { useTask } from '../contexts/TaskContext'

export default function TaskForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { createTask } = useTask()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('El título es requerido')
      return
    }

    setLoading(true)

    try {
      await createTask(title, description)
      setTitle('')
      setDescription('')
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear la tarea')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6">
      <h3 className="text-lg sm:text-xl font-semibold mb-4">Crear Nueva Tarea</h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded mb-4 text-sm sm:text-base">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Título *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Comprar groceries"
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm sm:text-base"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2 text-sm sm:text-base">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalles de la tarea (opcional)"
            rows="3"
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm sm:text-base"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded transition text-sm sm:text-base"
        >
          {loading ? 'Creando...' : '+ Crear Tarea'}
        </button>
      </form>
    </div>
  )
}
