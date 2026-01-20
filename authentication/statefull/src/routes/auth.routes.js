import { Router } from "express";
import { register } from "../controllers/auth.controllers.js";

const router = Router();

router.post("/register" , register)
// router.post("/login")
// router.post("/logout")
// router.get("/me")

export default router;