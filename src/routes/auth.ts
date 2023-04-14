import express from "express";
const router = express.Router();

import { authController } from "../controllers";
import { auth } from "../middlewares";

// register
router.post("/register", authController.register);
// login
router.post("/login", authController.login);
// all users
router.get("/", auth, authController.all);

export default router;
