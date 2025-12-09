import TaskModel from "../models/taskModel.js";

class TaskController {
  // ============================================================
  // CREATE TASK
  // ============================================================
  static async createTask(req, res) {
    try {
      const { title, description } = req.body;
      const userId = req.user.id;

      if (!title) {
        return res.status(400).json({
          success: false,
          message: "Title is required.",
        });
      }

      const task = await TaskModel.createTask({
        userId,
        title,
        description: description || "",
      });

      return res.status(201).json({
        success: true,
        message: "Task created successfully.",
        task,
      });

    } catch (error) {
      console.error("Create Task Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }

  // ============================================================
  // GET ALL TASKS
  // ============================================================
  static async getAllTasks(req, res) {
    try {
      const userId = req.user.id;

      const tasks = await TaskModel.getTasksByUser(userId);
      const total = await TaskModel.getTaskCount(userId);
      const completed = await TaskModel.getCompletedCount(userId);

      return res.status(200).json({
        success: true,
        tasks,
        stats: {
          total,
          completed,
          pending: total - completed,
        },
      });

    } catch (error) {
      console.error("Get All Tasks Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }

  // ============================================================
  // GET TASK BY ID
  // ============================================================
  static async getTaskById(req, res) {
    try {
      const { taskId } = req.params;
      const userId = req.user.id;

      const task = await TaskModel.getTaskById(taskId, userId);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found.",
        });
      }

      return res.status(200).json({
        success: true,
        task,
      });

    } catch (error) {
      console.error("Get Task By ID Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }

  // ============================================================
  // UPDATE TASK
  // ============================================================
  static async updateTask(req, res) {
    try {
      const { taskId } = req.params;
      const { title, description, completed } = req.body;
      const userId = req.user.id;

      // Validar que la tarea existe
      const existingTask = await TaskModel.getTaskById(taskId, userId);

      if (!existingTask) {
        return res.status(404).json({
          success: false,
          message: "Task not found.",
        });
      }

      // Actualizar solo los campos proporcionados
      const updatedTask = await TaskModel.updateTask({
        taskId,
        userId,
        title: title !== undefined ? title : existingTask.title,
        description: description !== undefined ? description : existingTask.description,
        completed: completed !== undefined ? completed : existingTask.completed,
      });

      return res.status(200).json({
        success: true,
        message: "Task updated successfully.",
        task: updatedTask,
      });

    } catch (error) {
      console.error("Update Task Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }

  // ============================================================
  // DELETE TASK
  // ============================================================
  static async deleteTask(req, res) {
    try {
      const { taskId } = req.params;
      const userId = req.user.id;

      // Validar que la tarea existe
      const task = await TaskModel.getTaskById(taskId, userId);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found.",
        });
      }

      const deleted = await TaskModel.deleteTask(taskId, userId);

      if (!deleted) {
        return res.status(400).json({
          success: false,
          message: "Failed to delete task.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Task deleted successfully.",
      });

    } catch (error) {
      console.error("Delete Task Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }

  // ============================================================
  // TOGGLE TASK COMPLETION
  // ============================================================
  static async toggleTask(req, res) {
    try {
      const { taskId } = req.params;
      const userId = req.user.id;

      const task = await TaskModel.getTaskById(taskId, userId);

      if (!task) {
        return res.status(404).json({
          success: false,
          message: "Task not found.",
        });
      }

      const updatedTask = await TaskModel.updateTask({
        taskId,
        userId,
        title: task.title,
        description: task.description,
        completed: !task.completed,
      });

      return res.status(200).json({
        success: true,
        message: "Task toggled successfully.",
        task: updatedTask,
      });

    } catch (error) {
      console.error("Toggle Task Error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error.",
      });
    }
  }
}

export default TaskController;
