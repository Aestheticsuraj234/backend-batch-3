import { Router } from "express";
import { checkAuth, login, logout, register } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const authRoutes = Router();

authRoutes.get("/check" , authenticate , checkAuth);

authRoutes.post("/login",login)


authRoutes.post("/register",register)

authRoutes.post("/logout" ,  logout)


export default authRoutes;