import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/error-handler";
import { router } from "./routes";
import { ApiError } from "./errors/api-error";

export const app = express();

app.use(cors());
app.use(express.json());

app.use(router);

app.use((_req, _res, next) => {
  next(new ApiError(404, "NOT_FOUND", "Resource not found"));
});

app.use(errorHandler);
