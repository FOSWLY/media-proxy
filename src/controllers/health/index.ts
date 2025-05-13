import { Elysia, t } from "elysia";

import config from "../../config";

export default new Elysia().group("/health", (app) =>
  app.get(
    "/",
    () => ({
      status: "ok" as const,
      version: config.app.version,
    }),
    {
      response: t.Object({
        status: t.Literal("ok", {
          default: "ok",
        }),
        version: t.String(),
      }),
    },
  ),
);
