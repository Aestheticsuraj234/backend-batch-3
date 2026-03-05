import { Router } from "express";
import { checkAuth, login, logout, register } from "../controllers/auth.controller.js";

const authRoutes = Router();

authRoutes.post("/login" , login)
authRoutes.post("/logout" , logout)
authRoutes.post("/register" , register)
authRoutes.get("/check" , checkAuth)

export default authRoutes;