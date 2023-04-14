import { PrismaClient } from "@prisma/client";
import { jwt } from "../utils";
import bcrypt from "bcryptjs";
import { RegisterUser, LoginUser } from "../types";
import createError from "http-errors";

const prisma = new PrismaClient();

class AuthService {
  static async register(data: RegisterUser) {
    console.log(data);
    if (!data || !data.email || !data.hashedPassword)
      throw createError.BadRequest("Invalid data");

    const { email } = data;

    data.hashedPassword = await bcrypt.hashSync(data.hashedPassword, 8);

    try {
      let user = await prisma.user.create({
        data,
      });

      data.accessToken = await jwt.signInAccessToken(user);

      return data;
    } catch (error) {
      throw createError.Conflict("User already registered");
    }
  }

  static async login(data: LoginUser) {
    console.log(data);
    if (!data || !data.email || !data.password)
      throw createError.BadRequest("Invalid data");

    const { email, password } = data;

    const user: any = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) throw createError.NotFound("User not registered");

    const checkPassword = bcrypt.compareSync(password, user.hashedPassword);
    if (!checkPassword) throw createError.Unauthorized("Invalid password");

    delete user.hashedPassword;

    const accessToken = await jwt.signInAccessToken(user);

    // update login count
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        loginsCount: user.loginsCount + 1,
        lastLogin: new Date(),
        lastIp: data.ipAddress,
        lastUserAgent: data.userAgent,
        lastReferrer: data.referer,
      },
    });

    return { ...user, accessToken };
  }

  static async allUsers() {
    const users = await prisma.user.findMany();
    return users;
  }
}

export default AuthService;
