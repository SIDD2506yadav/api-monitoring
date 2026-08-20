import { Router } from "express";
import { validateBody } from "../middleware/validate";
import { createMonitorSchema } from "../schemas/monitor";
import { createMonitorService } from "../services/monitor.service";

const monitorsRouter = Router();

monitorsRouter.post(
  "/monitors",
  validateBody(createMonitorSchema),
  async (req, res, next) => {
    try {
      const monitor = await createMonitorService(req.body);

      res.status(201).json({
        data: monitor,
      });
    } catch (error) {
      next(error);
    }
  },
);

export { monitorsRouter };
