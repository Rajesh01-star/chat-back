import { Context } from "elysia";
import { jwt } from "../utils";
import { prismaClient } from "../client/db";

/**
 * @name auth
 * @description Middleware to protect routes with JWT
 */
export const auth: any = async (c: Context) => {
  let token;
  if (c.headers.cookie?.includes("better-auth")) {
    try {
      token = c.headers.cookie?.split("=")[1];
      console.log("token", token);
      const decoded = await jwt.verify(token);
      console.log("decoded", decoded);
      const user = await prismaClient.user.findUnique({
        where: {
          email: decoded.email as string,
        },
      });

      if (!user) {
        c.set.status = 401;
        throw new Error("Not authorized, User not found!");
      }

      c.request.headers.set("userId", user.id);
      //   c.request.headers.set("isAdmin", user?.isAdmin ? "true" : "false");
    } catch (error) {
      c.set.status = 401;
      throw new Error("Not authorized, Invalid token!");
    }
  }

  if (!token) {
    c.set.status = 401;
    throw new Error("Not authorized, No token found!");
  }
};

/**
 * @name admin
 * @description Middleware to protect routes with JWT and protect routes for admin only
 */
export const admin: any = async (c: Context) => {
  await auth(c);

  const isAdmin = c.request.headers.get("isAdmin");

  if (!isAdmin || isAdmin === "false") {
    c.set.status = 401;
    throw new Error("Not authorized as an Admin!");
  }
};
