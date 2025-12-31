import { Router } from "express";
import { Login, Logout } from "../controllers/auth.controller.js";

const authRoutes = Router()

authRoutes.post("/login" , Login)

authRoutes.get("/logout" , Logout)


export default authRoutes