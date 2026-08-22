import type { NextFunction, Request, Response } from "express";
import {
  createMonitorService,
  deleteMonitorService,
  listMonitorsService,
  updateMonitorService,
} from "../services/monitor.service";

export async function createMonitorController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const monitor = await createMonitorService(req.body);

    res.status(201).json({
      data: monitor,
    });
  } catch (error) {
    next(error);
  }
}

export async function listMonitorsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const monitors = await listMonitorsService({
      userId: req.query.userId as string,
    });

    res.json({
      data: monitors,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateMonitorController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const monitor = await updateMonitorService(
      req.params.id as string,
      req.body,
    );

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
}

export async function deleteMonitorController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const monitor = await deleteMonitorService(req.params.id as string);

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
}
