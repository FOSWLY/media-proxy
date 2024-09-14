import path from "node:path";
import { type Level } from "pino";

import { version } from "../package.json";

export default {
  server: {
    port: Bun.env.SERVICE_PORT ?? 3001,
    hostname: Bun.env.SERVICE_HOST ?? "0.0.0.0",
    isSupportHttps: Bun.env.IS_SUPPORT_HTTPS ? Bun.env.IS_SUPPORT_HTTPS === "true" : true,
  },
  app: {
    name: Bun.env.APP_NAME ?? "[FOSWLY] Media proxy",
    desc:
      Bun.env.APP_DESC ??
      "[FOSWLY] Media Proxy is a proxy server for proxying various video files.",
    version,
    license: "MIT",
    github_url: "https://github.com/FOSWLY/media-proxy",
    contact_email: Bun.env.APP_CONTACT_EMAIL ?? "me@toil.cc",
    scalarCDN: "https://unpkg.com/@scalar/api-reference@1.15.1/dist/browser/standalone.js",
  },
  cors: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Max-Age": "86400",
  },
  logging: {
    level: (Bun.env.NODE_ENV === "production" ? "info" : "debug") as Level,
    logPath: path.join(__dirname, "..", "logs"),
    loki: {
      host: Bun.env.LOKI_HOST ?? "",
      user: Bun.env.LOKI_USER ?? "",
      password: Bun.env.LOKI_PASSWORD ?? "",
      label: Bun.env.LOKI_LABEL ?? "media-proxy",
    },
  },
  userAgent:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 YaBrowser/24.7.0.0 Safari/537.36",
};
