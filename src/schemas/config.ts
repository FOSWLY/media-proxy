import { Type as t, type Static } from "@sinclair/typebox";

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

const license = "MIT";
const scalarCDN = "https://unpkg.com/@scalar/api-reference@1.15.1/dist/browser/standalone.js";

export const ConfigSchema = t.Object({
  server: t.Object({
    port: t.Number({ default: 3001 }),
    hostname: t.String({ default: "0.0.0.0" }),
    isSupportHttps: t.Boolean({ default: true }),
  }),
  app: t.Object({
    name: t.String({ default: "[FOSWLY] Media proxy" }),
    desc: t.String({
      default: "[FOSWLY] Media Proxy is a proxy server for proxying various video files.",
    }),
    version: t.Literal(version, { readOnly: true, default: version }),
    license: t.Literal(license, { readOnly: true, default: license }),
    github_url: t.String({
      default: "https://github.com/FOSWLY/media-proxy",
    }),
    contact_email: t.String({ default: "me@toil.cc" }),
    scalarCDN: t.Literal(scalarCDN, { readOnly: true, default: scalarCDN }),
  }),
  cors: t.Object({
    "Access-Control-Allow-Origin": t.String({ default: "*" }),
    "Access-Control-Allow-Headers": t.String({ default: "*" }),
    "Access-Control-Allow-Methods": t.String({ default: "POST, GET, OPTIONS" }),
    "Access-Control-Max-Age": t.String({ default: "86400" }),
  }),
  logging: t.Object({
    level: LoggingLevel,
    logPath: t.String(),
    loki: t.Object({
      host: t.String({ default: "" }),
      user: t.String({ default: "" }),
      password: t.String({ default: "" }),
      label: t.String({ default: "media-proxy" }),
    }),
  }),
  utility: t.Object({
    userAgent: t.String({
      default:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 YaBrowser/24.7.0.0 Safari/537.36",
    }),
  }),
});

export type ConfigSchemaType = Static<typeof ConfigSchema>;
