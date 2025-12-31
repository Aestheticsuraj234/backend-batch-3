import { Router } from "express";
import { createTask, getAllTasks } from "../controllers/task.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const taskRoutes = Router()

taskRoutes.post("/" , authMiddleware , createTask)

taskRoutes.get("/" , authMiddleware , getAllTasks)


export default taskRoutes