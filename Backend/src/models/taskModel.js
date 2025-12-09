import { pool } from "../../Database/connection.js";

class TaskModel {
  // ============================================================
  // CREATE TASK
  // ============================================================
  static async createTask({ userId, title, description }) {
    const query = `
      INSERT INTO tasks (user_id, title, description)
      VALUES (?, ?, ?)
    `;

    const [result] = await pool.execute(query, [userId, title, description]);

    return {
      id: result.insertId,
      user_id: userId,
      title,
      description,
      completed: false,
      created_at: new Date(),
    };
  }

  // ============================================================
  // GET ALL TASKS BY USER
  // ============================================================
  static async getTasksByUser(userId) {
    const query = `
      SELECT id, user_id, title, description, completed, created_at, updated_at
      FROM tasks
      WHERE user_id = ?
      ORDER BY created_at DESC
    `;

    const [rows] = await pool.execute(query, [userId]);
    return rows;
  }

  // ============================================================
  // GET TASK BY ID
  // ============================================================
  static async getTaskById(taskId, userId) {
    const query = `
      SELECT id, user_id, title, description, completed, created_at, updated_at
      FROM tasks
      WHERE id = ? AND user_id = ?
      LIMIT 1
    `;

    const [rows] = await pool.execute(query, [taskId, userId]);
    return rows.length > 0 ? rows[0] : null;
  }

  // ============================================================
  // UPDATE TASK
  // ============================================================
  static async updateTask({ taskId, userId, title, description, completed }) {
    const query = `
      UPDATE tasks
      SET title = ?, description = ?, completed = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?
    `;

    const [result] = await pool.execute(query, [title, description, completed, taskId, userId]);

    if (result.affectedRows === 0) {
      return null;
    }

    return await this.getTaskById(taskId, userId);
  }

  // ============================================================
  // DELETE TASK
  // ============================================================
  static async deleteTask(taskId, userId) {
    const query = `
      DELETE FROM tasks
      WHERE id = ? AND user_id = ?
    `;

    const [result] = await pool.execute(query, [taskId, userId]);
    return result.affectedRows > 0;
  }

  // ============================================================
  // GET TASK COUNT BY USER
  // ============================================================
  static async getTaskCount(userId) {
    const query = `
      SELECT COUNT(*) as total FROM tasks
      WHERE user_id = ?
    `;

    const [rows] = await pool.execute(query, [userId]);
    return rows[0].total;
  }

  // ============================================================
  // GET COMPLETED TASKS COUNT
  // ============================================================
  static async getCompletedCount(userId) {
    const query = `
      SELECT COUNT(*) as completed FROM tasks
      WHERE user_id = ? AND completed = TRUE
    `;

    const [rows] = await pool.execute(query, [userId]);
    return rows[0].completed;
  }
}

export default TaskModel;
