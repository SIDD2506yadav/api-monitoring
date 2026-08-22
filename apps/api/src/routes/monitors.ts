import { Router } from "express";
import { validateBody } from "../middleware/validate";
import {
  createMonitorController,
  deleteMonitorController,
  listMonitorsController,
  updateMonitorController,
} from "../controllers/monitor.controller";
import { createMonitorSchema, updateMonitorSchema } from "../schemas/monitor";

const monitorsRouter = Router();

monitorsRouter.post(
  "/monitors",
  validateBody(createMonitorSchema),
  createMonitorController,
);

monitorsRouter.get("/monitors", listMonitorsController);

monitorsRouter.patch(
  "/monitors/:id",
  validateBody(updateMonitorSchema),
  updateMonitorController,
);

monitorsRouter.delete("/monitors/:id", deleteMonitorController);

export { monitorsRouter };
