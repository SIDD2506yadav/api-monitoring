import { Router } from "express";
import { healthRouter } from "./health";
import { monitorsRouter } from "./monitors";

const router = Router();

router.use(healthRouter);
router.use(monitorsRouter);

export { router };
