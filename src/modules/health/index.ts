import Elysia from "elysia";

import { HealthModel } from "./model";
import config from "@/shared/config";

export default new Elysia({
  detail: {
    tags: ["Health"],
  },
}).group("/health", (app) =>
  app.get(
    "/",
    async () => {
      return { status: "ok", version: config.app.version } as const;
    },
    {
      response: {
        200: HealthModel.getResponse,
      },
      detail: {
        summary: "Check a health status",
      },
    },
  ),
);
