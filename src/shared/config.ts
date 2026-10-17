import path from "node:path";

import { defineConfig, env, t } from "@nirelc/microconf";

import { version } from "../../package.json";

export const LoggingLevel = t
  .union([
    t.literal("info"),
    t.literal("debug"),
    t.literal("fatal"),
    t.literal("error"),
    t.literal("warn"),
    t.literal("trace"),
  ])
  .default("info");

const APP_LICENSE = "MIT";
const SCALAR_CDN =
  "https://unpkg.com/@scalar/api-reference@latest/dist/browser/standalone.js";
const GITHUB_URL = "https://github.com/FOSWLY/media-proxy";
const CONTACT_EMAIL = "me@toil.cc";
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 YaBrowser/26.6.0.0 Safari/537.36";

export default defineConfig({
  schema: {
    server: {
      port: t.number().default(3001),
      hostname: t.string().default("0.0.0.0"),
      isSupportHttps: t.boolean().default(false),
    },
    app: {
      name: t.string().default("[FOSWLY] Media proxy"),
      desc: t
        .string()
        .default(
          "[FOSWLY] Media Proxy is a proxy server for proxying various video files.",
        ),
      version: t.literal(version).default(version),
      license: t.literal(APP_LICENSE).default(APP_LICENSE),
      githubUrl: t.string().default(GITHUB_URL),
      contactEmail: t.string().default(CONTACT_EMAIL),
      scalarCDN: t.literal(SCALAR_CDN).default(SCALAR_CDN),
    },
    cors: {
      allowedHeaders: t.string().default("*"),
      origin: t.string().default("*"),
      methods: t.string().default("GET, POST, OPTIONS"),
      maxAge: t.number().default(86400),
    },
    logging: {
      level: LoggingLevel.transform(() => {
        return Bun.env.NODE_ENV === "production" ? "info" : "debug";
      }),
      logPath: t.string().default(path.join(__dirname, "..", "logs")),
      logToFile: t.boolean().default(false),
      loki: {
        host: t.string().default(""),
        user: t.string().default(""),
        password: t.string().default(""),
        label: t.string().default("media-proxy"),
      },
    },
    utility: {
      userAgent: t.string().default(USER_AGENT),
    },
  },
  sources: [
    env({
      delimiter: "_",
      renames: {
        SERVER_PORT: "SERVICE_PORT",
        SERVER_HOSTNAME: "SERVICE_HOST",
        SERVER_IS_SUPPORT_HTTPS: "IS_SUPPORT_HTTPS",
        LOGGING_LOG_TO_FILE: "LOG_TO_FILE",
        LOGGING_LOKI_HOST: "LOKI_HOST",
        LOGGING_LOKI_USER: "LOKI_USER",
        LOGGING_LOKI_PASSWORD: "LOKI_PASSWORD",
        LOGGING_LOKI_LABEL: "LOKI_LABEL",
      },
    }),
  ],
});
