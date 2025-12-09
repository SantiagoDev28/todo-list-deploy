import { AuthProvider } from './contexts/AuthContext'
import { TaskProvider } from './contexts/TaskContext'
import { useAuth } from './contexts/AuthContext'
import AuthPage from './components/AuthPage'
import TaskDashboard from './components/TaskDashboard'

function AppContent() {
  const { isAuthenticated, user, logout, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow">
          <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-blue-600">Mi Lista</h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <span className="text-gray-700 font-semibold text-sm sm:text-base">Hola, <span className="text-blue-600">{user?.name}</span></span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-2 rounded font-semibold transition text-sm sm:text-base"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </nav>
        <main className="max-w-6xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <TaskDashboard />
        </main>
      </div>
    )
  }

  return <AuthPage />
}

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <AppContent />
      </TaskProvider>
    </AuthProvider>
  )
}

export default App
