import { Router } from "express";
import {authenticate , checkAdmin} from "../middleware/auth.middleware.js"
import { createProblem } from "../controllers/problems.controller.js";

const problemRoutes = Router();

problemRoutes.post("/create-problem" , authenticate , checkAdmin , createProblem)

export default problemRoutes;