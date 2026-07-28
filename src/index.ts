import { Elysia } from "elysia";
import { HttpStatusCode } from "elysia-http-status-code";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";

import config from "@/shared/config";

import healthController from "./modules/health";
import proxyController from "./modules/proxy";
import { log } from "./logging";
import { InvalidMediaFile, UnknownVideoFormat } from "@/modules/proxy/error";

const {
  server: { hostname, port },
  app: {
    name: title,
    desc: description,
    version,
    license,
    githubUrl,
    contactEmail,
  },
} = config;

export const app = new Elysia({ prefix: "/v1" })
  .use(
    swagger({
      path: "/docs",
      excludeStaticFile: false,
      documentation: {
        info: {
          title,
          description,
          version,
          license: {
            name: license,
          },
          contact: {
            name: "Developer",
            url: githubUrl,
            email: contactEmail,
          },
        },
      },
    }),
  )
  .use(HttpStatusCode())
  .use(cors(config.cors))
  .error({
    INVALID_MEDIA_FILE: InvalidMediaFile,
    UNKNOWN_MEDIA_FORMAT: UnknownVideoFormat,
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
      case "UNKNOWN_MEDIA_FORMAT":
        set.status = httpStatus.HTTP_400_BAD_REQUEST;
        break;
    }

    return {
      error: (error as Error).message,
    };
  })
  .use(healthController)
  .use(proxyController)
  .listen({
    port,
    hostname,
  });

log.info(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
