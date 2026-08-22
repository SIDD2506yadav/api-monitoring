import { Router } from "express";
import { validateBody } from "../middleware/validate";
import {
  createMonitorSchema,
  listMonitorsSchema,
  updateMonitorSchema,
} from "../schemas/monitor";
import {
  createMonitorService,
  listMonitorsService,
  deleteMonitorService,
  updateMonitorService,
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

monitorsRouter.delete("/monitors/:id", async (req, res, next) => {
  try {
    const monitor = await deleteMonitorService(req.params.id);

    if (!monitor) {
      res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Monitor not found",
        },
      });
      return;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

monitorsRouter.patch("/monitors/:id", async (req, res, next) => {
  try {
    const result = updateMonitorSchema.safeParse(req.body);

    if (!result.success) {
      next(result.error);
      return;
    }

    const monitor = await updateMonitorService(req.params.id, result.data);

    if (!monitor) {
      res.status(404).json({
        error: {
          code: "NOT_FOUND",
          message: "Monitor not found",
        },
      });
      return;
    }

    res.json({
      data: monitor,
    });
  } catch (error) {
    next(error);
  }
});

export { monitorsRouter };
