import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import { AuthService } from "../services";

class authController {
  static register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await AuthService.register(req.body);
      res.status(200).json({
        status: true,
        message: "User registered successfully",
        data: user,
      });
    } catch (e) {
      next(createError(400, (e as Error).message));
    }
  };

  static login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await AuthService.login({
        ...req.body,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"] ?? null,
        referer: req.headers.referer ?? null,
      });
      res.status(200).json({
        status: true,
        message: "User logged in successfully",
        data,
      });
    } catch (e: any) {
      next(createError(400, (e as Error).message));
    }
  };

  static all = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await AuthService.allUsers();
      res.status(200).json({
        status: true,
        message: "All users",
        data: users,
      });
    } catch (e: any) {
      next(createError(400, (e as Error).message));
    }
  };
}

export default authController;
