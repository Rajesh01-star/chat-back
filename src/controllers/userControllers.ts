import { Context } from "elysia";
import { prismaClient } from "../client/db";

export const getUser = async (c: Context) => {
  // Get user id from token (set by auth middleware)
  const userId = c.request.headers.get("userId");

  if (!userId) {
    c.set.status = 400;
    return {
      success: false,
      message: "User ID not found in request",
    };
  }

  const user = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    c.set.status = 404;
    return {
      success: false,
      message: "User not found",
    };
  }

  return {
    success: true,
    user,
  };
};
