import "dotenv/config";
import { Elysia } from "elysia";
import { error, logger } from "./middlewares";
import { auth } from "./lib/server";
import { cors } from "@elysiajs/cors";
import * as pico from "picocolors";
import userRoutes from "./routes/userRoutes";
import { corsConfig } from "./lib/configs";

const betterAuth = new Elysia({ name: "better-auth" }).all(
  "/api/auth/*",
  ({ request }) => auth.handler(request)
);

const app = new Elysia()
  .use(cors(corsConfig))
  .use(error())
  .use(logger())
  .use(betterAuth)
  .use(userRoutes)
  .listen(process.env.PORT!, () => {
    console.log(pico.cyan(`🦊 Elysia is running at ${process.env.PORT}`));
  });

app.get("/health", () => {
  return {
    message: "Fcuk Hello World",
  };
});
