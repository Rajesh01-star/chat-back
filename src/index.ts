import "dotenv/config";
import { Elysia } from "elysia";
import { error, logger } from "./middlewares";
import { auth } from "./lib/server";
import { cors } from "@elysiajs/cors";
import * as pico from "picocolors";
import userRoutes from "./routes/userRoutes";
import { corsConfig } from "./lib/configs";

const port = process.env.PORT || 3000;

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
  .listen(port, () => {
    console.log(pico.cyan(`🦊 Elysia is running at ${port}`));
  });

app.get("/health", () => {
  return {
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  };
});

export default app;
