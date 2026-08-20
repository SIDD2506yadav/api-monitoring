import { createDatabase } from "@api-monitoring/database";
import { env } from "../config/env";

export const { db, pool } = createDatabase(env.DATABASE_URL);
