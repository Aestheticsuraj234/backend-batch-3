import { Router } from "express";
import { getCurrentUser, login, logout, register } from "../controllers/auth.controllers.js";
import { isAuthenticated, logger } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register" , register)
router.post("/login" , login)
router.post("/logout" , isAuthenticated , logout)
router.get("/me" , isAuthenticated ,logger ,  getCurrentUser)

export default router;