import { Router } from "express";
import { validateBody } from "../middleware/validate";
import { createMonitorSchema, listMonitorsSchema } from "../schemas/monitor";
import {
  createMonitorService,
  listMonitorsService,
} from "../services/monitor.service";

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

monitorsRouter.get("/monitors", async (req, res, next) => {
  try {
    const result = listMonitorsSchema.safeParse({
      userId: req.query.userId,
    });

    if (!result.success) {
      next(result.error);
      return;
    }

    const monitors = await listMonitorsService(result.data);

    res.json({
      data: monitors,
    });
  } catch (error) {
    next(error);
  }
});

export { monitorsRouter };
