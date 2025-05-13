import path from "node:path";

import { Value } from "@sinclair/typebox/value";

import { ConfigSchema, ConfigSchemaType } from "./schemas/config";
import { DeepPartial } from "./types/utils";

export default Value.Parse(ConfigSchema, {
  server: {
    port: Bun.env.SERVICE_PORT,
    hostname: Bun.env.SERVICE_HOST,
    isSupportHttps: Bun.env.IS_SUPPORT_HTTPS === "true",
  },
  app: {
    name: Bun.env.APP_NAME,
    desc: Bun.env.APP_DESC,
    contact_email: Bun.env.APP_CONTACT_EMAIL,
  },
  cors: {},
  logging: {
    level: Bun.env.NODE_ENV === "production" ? "info" : "debug",
    logPath: path.join(__dirname, "..", "logs"),
    logToFile: Bun.env.LOG_TO_FILE === "true",
    loki: {
      host: Bun.env.LOKI_HOST,
      user: Bun.env.LOKI_USER,
      password: Bun.env.LOKI_PASSWORD,
      label: Bun.env.LOKI_LABEL,
    },
  },
  utility: {},
} as const satisfies DeepPartial<ConfigSchemaType>);
