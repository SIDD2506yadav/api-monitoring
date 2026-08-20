import "dotenv/config";
import express from "express";
import cors from "cors";
import { env } from "./config/env";

const app = express();
const PORT = env.PORT;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
