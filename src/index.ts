import { Elysia } from "elysia";
import { HttpStatusCode } from "elysia-http-status-code";
import { swagger } from "@elysiajs/swagger";

import * as fs from "fs";

import config from "./config";

import healthController from "./controllers/health";
import proxyController from "./controllers/proxy";
import { log } from "./logging";
import { InvalidMediaFile } from "./errors";

if (!fs.existsSync(config.logging.logPath)) {
  fs.mkdirSync(config.logging.logPath, { recursive: true });
  log.info(`Created log directory`);
}

const app = new Elysia({ prefix: "/v1" })
  .use(
    swagger({
      path: "/docs",
      documentation: {
        info: {
          title: config.app.name,
          version: config.app.version,
          license: {
            name: config.app.license,
          },
          contact: {
            name: "Developer",
            url: config.app.github_url,
            email: config.app.contact_email,
          },
        },
      },
    }),
  )
  .use(HttpStatusCode())
  .onRequest(({ set }) => {
    for (const [key, val] of Object.entries(config.cors)) {
      set.headers[key] = val;
    }
  })
  .error({
    INVALID_MEDIA_FILE: InvalidMediaFile,
  })
  .onError(({ set, code, error, httpStatus }) => {
    switch (code) {
      case "NOT_FOUND":
        return {
          detail: "Route not found :(",
        };
      case "VALIDATION":
        return error.all;
      case "INVALID_MEDIA_FILE":
        set.status = httpStatus.HTTP_400_BAD_REQUEST;
        break;
    }
    return {
      error: error.message,
    };
  })
  .use(healthController)
  .use(proxyController)
  .listen({
    port: config.server.port,
    hostname: config.server.hostname,
  });

log.info(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
