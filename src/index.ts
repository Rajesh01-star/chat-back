import "dotenv/config";
import { Elysia } from "elysia";
import { error, logger } from "./middlewares/index.js";
import { auth } from "./lib/server.js";
import { cors } from "@elysiajs/cors";
import * as pico from "picocolors";
import userRoutes from "./routes/userRoutes.js";
import { corsConfig } from "./lib/configs.js";

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
  .use(userRoutes);

app.get("/health", () => {
  return {
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  };
});

// Only start the server if this file is run directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(port, () => {
    console.log(pico.cyan(`🦊 Elysia is running at ${port}`));
  });
}

export default app;
