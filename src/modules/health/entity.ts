import { t } from "elysia";

import config from "@/shared/config";

export const HealthData = t.Object({
  status: t.Literal("ok"),
  version: t.Literal(config.app.version),
});
