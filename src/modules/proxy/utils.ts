import config from "@/shared/config";
import { InvalidMediaFile } from "./error";
import { log } from "@/logging";
import { VideoProxyOpts } from "./entity";
import { base64ToHeaders } from "@/shared/request";

const getFetchOpts = (
  headers: Record<string, unknown> = {},
  referer?: string,
  origin?: string,
) => {
  return {
    headers: {
      Referer: referer,
      Origin: origin,
      "User-Agent": config.utility.userAgent,
      ...headers,
    },
    redirect: "follow",
  } as RequestInit;
};

const addScheme = (domain: string | undefined) => {
  if (!domain || /http(s)?:\/\//.exec(domain)) {
    return domain;
  }

  if (domain.includes("//")) {
    domain = domain.split("//")?.[1];
  }

  return `https://${domain}`;
};

export async function fetchMedia(
  mediaUrl: URL,
  referer?: string,
  origin?: string,
  headers?: Record<string, unknown>,
) {
  try {
    return await fetch(mediaUrl, getFetchOpts(headers, referer, origin));
  } catch (err) {
    throw new InvalidMediaFile((err as Error)?.message);
  }
}

export function fixQueryArgs(
  { referer, origin, url, force, format, headers }: VideoProxyOpts,
  updateForM3U8 = false,
) {
  if (format === "base64") {
    try {
      url = atob(url);
    } catch (err) {
      log.error({
        format,
        url,
        force,
        origin,
        referer,
        error: (err as Error).message,
      });
      throw new InvalidMediaFile("invalid base64-encoded URL");
    }
  } else {
    url = decodeURIComponent(url);
  }

  if (updateForM3U8 && origin && /[^https:]\/\//.exec(url)) {
    // for m3u8 only
    const realPath = url.split("//")[2];
    url = `${origin}/${realPath}`;
  }

  let headersData = base64ToHeaders(headers);
  url = addScheme(url)!;
  referer = addScheme(decodeURIComponent(referer ?? ""))!;
  origin = addScheme(decodeURIComponent(origin ?? ""))!;
  return {
    referer,
    origin,
    url,
    force,
    headers: headersData,
  };
}
