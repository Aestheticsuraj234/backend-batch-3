import {Router} from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { createProject } from "../controllers/project.controller.js";


const router = Router();

router.post("/" , authenticate , createProject)
// router.get("/")
// router.get("/:id")
// delete and update

export default router;