import { Elysia } from "elysia";
import { auth } from "../lib/server";
import { prismaClient } from "../client/db";

const userRoutes = (app: Elysia) => {
  return app.group("/api/v1/users", (app) =>
    //  Get a single user
    app.get("/profile", async ({ request }: { request: any }) => {
      const session = await auth.api.getSession({ headers: request.headers });
      if (!session) return { error: "No session" };
      const user = await prismaClient.user.findUnique({
        where: {
          email: session?.user.email,
        },
      });
      return {
        user,
      };
    })
  );
};

export default userRoutes as any;
