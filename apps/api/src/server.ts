import "dotenv/config";
import { createServer } from "node:http";
import { app } from "./app";
import { env } from "./config/env";
import { pool } from "./database";

const server = createServer(app);

server.listen(env.PORT, () => {
  console.log(`API running on http://localhost:${env.PORT}`);
});

const shutdown = async (signal: string) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);

  server.close(async (error) => {
    if (error) {
      console.error("Failed to close HTTP server:", error);
      return;
    }

    try {
      await pool.end();
      console.log("Database connection pool closed.");
    } catch (error) {
      console.error("Failed to close database connection pool:", error);
    }
  });
};

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
