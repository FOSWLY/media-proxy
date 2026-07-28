import path from "node:path";

import { Value } from "@sinclair/typebox/value";
import { Type as t, type Static } from "@sinclair/typebox";

import type { DeepPartial } from "@/types/utils";
import { version } from "../../package.json";

export const LoggingLevel = t.Union(
  [
    t.Literal("info"),
    t.Literal("debug"),
    t.Literal("fatal"),
    t.Literal("error"),
    t.Literal("warn"),
    t.Literal("trace"),
  ],
  {
    default: "info",
  },
);

const APP_LICENSE = "MIT";
const SCALAR_CDN =
  "https://unpkg.com/@scalar/api-reference@latest/dist/browser/standalone.js";
const GITHUB_URL = "https://github.com/FOSWLY/media-proxy";
const CONTACT_EMAIL = "me@toil.cc";
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 YaBrowser/26.6.0.0 Safari/537.36";

const ConfigSchema = t.Object({
  server: t.Object({
    port: t.Number({ default: 3001 }),
    hostname: t.String({ default: "0.0.0.0" }),
    isSupportHttps: t.Boolean({ default: true }),
  }),
  app: t.Object({
    name: t.String({ default: "[FOSWLY] Media proxy" }),
    desc: t.String({
      default:
        "[FOSWLY] Media Proxy is a proxy server for proxying various video files.",
    }),
    version: t.Literal(version, { readOnly: true, default: version }),
    license: t.Literal(APP_LICENSE, { readOnly: true, default: APP_LICENSE }),
    githubUrl: t.String({
      default: GITHUB_URL,
    }),
    contactEmail: t.String({ default: CONTACT_EMAIL }),
    scalarCDN: t.Literal(SCALAR_CDN, { readOnly: true, default: SCALAR_CDN }),
  }),
  cors: t.Object({
    allowedHeaders: t.String({ default: "*" }),
    origin: t.String({ default: "*" }),
    methods: t.String({ default: "GET, POST, OPTIONS" }),
    maxAge: t.Number({ default: 86400 }),
  }),
  logging: t.Object({
    level: LoggingLevel,
    logPath: t.String(),
    logToFile: t.Boolean(),
    loki: t.Object({
      host: t.String({ default: "" }),
      user: t.String({ default: "" }),
      password: t.String({ default: "" }),
      label: t.String({ default: "media-proxy" }),
    }),
  }),
  utility: t.Object({
    userAgent: t.String({
      default: USER_AGENT,
    }),
  }),
});

export type ConfigSchemaType = Static<typeof ConfigSchema>;

export default Value.Parse(ConfigSchema, {
  server: {
    port: Bun.env.SERVICE_PORT,
    hostname: Bun.env.SERVICE_HOST,
    isSupportHttps: Bun.env.IS_SUPPORT_HTTPS === "true",
  },
  app: {
    name: Bun.env.APP_NAME,
    desc: Bun.env.APP_DESC,
    contactEmail: Bun.env.APP_CONTACT_EMAIL,
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
