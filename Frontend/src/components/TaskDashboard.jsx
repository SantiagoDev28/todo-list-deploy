import TaskForm from './TaskForm'
import TaskList from './TaskList'

export default function TaskDashboard() {
  return (
    <div className="space-y-6">
      <TaskForm />
      <TaskList />
    </div>
  )
}
