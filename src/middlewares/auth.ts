import { NextFunction, Request, Response } from "express";
import { jwt } from "../utils";
import createError from "http-errors";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) return next(createError(401, "Unauthorized"));

  const token = req.headers.authorization.split(" ")[1];

  if (!token) return next(createError(401, "Unauthorized"));

  await jwt
    .verifyAccessToken(token)
    .then((user) => {
      (req as any).user = user;
      next();
    })
    .catch((e) => {
      next(createError.Unauthorized(e.message));
    });
};

export default auth;
