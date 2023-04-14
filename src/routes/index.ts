import express, { NextFunction, Request, Response } from "express";
import createError from "http-errors";

import auth from "./auth";

import { console } from "../utils";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: true,
    message: "Welcome to the API",
  });
});

router.use("/auth", auth);

router.use((req: Request, res: Response, next: NextFunction) => {
  next(createError.NotFound("Route not Found"));
});

router.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({
    status: false,
    message: err.message,
  });
});

export default router;
