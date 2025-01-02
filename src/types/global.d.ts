declare module "bun" {
  interface Env {
    SERVICE_PORT?: number;
    SERVICE_HOST?: string;
    IS_SUPPORT_HTTPS?: string;
    LOKI_HOST?: string;
    LOKI_USER?: string;
    LOKI_PASSWORD?: string;
    LOKI_LABEL?: string;
    LOG_TO_FILE: "true" | "false";
  }
}
