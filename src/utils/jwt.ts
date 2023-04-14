import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import createError from "http-errors";

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as Secret;

const signInAccessToken = (
  payload: JwtPayload
): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    jwt.sign({ payload }, accessTokenSecret, {}, (err, token) => {
      if (err) reject(createError.InternalServerError());
      resolve(token);
    });
  });
};

const verifyAccessToken = (token: any) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, accessTokenSecret, (err: any, payload: any) => {
      if (err) {
        const message =
          err.name == "JsonWebTokenError" ? "Unauthorized" : err.message;
        return reject(createError.Unauthorized(message));
      }
      resolve(payload);
    });
  });
};

export { signInAccessToken, verifyAccessToken };
