import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createTask, getAllTasks } from "../controllers/task.controller.js";

const router = Router();

router.get("/",authMiddleware, getAllTasks);

router.post("/", authMiddleware,createTask);

router.put("/:id", authMiddleware,(req, res) => {});

router.delete("/:id", authMiddleware,(req, res) => {});

export default router;