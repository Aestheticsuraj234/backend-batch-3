import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { executeCode } from "../controllers/executeCode.controller.js";

const executeCodeRoutes = Router();

executeCodeRoutes.post("/" , authenticate , executeCode )


export default executeCodeRoutes;