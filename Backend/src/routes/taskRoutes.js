import { Router } from "express";
import TaskController from "../controllers/taskController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

// ============================================================
// TODAS LAS RUTAS DE TAREAS REQUIEREN AUTENTICACIÓN
// ============================================================

// Crear tarea
router.post("/", verifyToken, TaskController.createTask);

// Obtener todas las tareas del usuario
router.get("/", verifyToken, TaskController.getAllTasks);

// Obtener tarea específica por ID
router.get("/:taskId", verifyToken, TaskController.getTaskById);

// Actualizar tarea
router.put("/:taskId", verifyToken, TaskController.updateTask);

// Eliminar tarea
router.delete("/:taskId", verifyToken, TaskController.deleteTask);

// Cambiar estado de tarea (marcar completada/pendiente)
router.patch("/:taskId/toggle", verifyToken, TaskController.toggleTask);

export default router;
