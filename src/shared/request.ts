import { log } from "@/logging";

const REMOVABLE_HEADERS = [
  "access-control-allow-origin",
  "access-control-allow-headers",
  "access-control-allow-credentials",
  "access-control-allow-methods",
  "date",
  "content-encoding",
  "content-length",
  "transfer-encoding",
] as const;

export function clearHeaders(headers: Headers) {
  for (const header of REMOVABLE_HEADERS) {
    headers.delete(header);
  }

  return headers;
}

const isObj = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export function base64ToHeaders(headers?: string) {
  if (!headers) {
    return {};
  }

  try {
    const parsedHeaders = JSON.parse(atob(headers)) as
      | Record<string, unknown>
      | string
      | unknown[];
    if (isObj(parsedHeaders)) {
      return parsedHeaders;
    }
  } catch (err) {
    log.debug(
      {
        headers,
        error: (err as Error).message,
      },
      "Failed to parse headers",
    );
  }

  return {};
}
