import { Elysia } from "elysia";

import mediaProxyModels from "@/models/proxy.model";
import config from "@/config";
import { InvalidMediaFile, UnknownVideoFormat } from "@/errors";
import { M3U8QueryArgs, VideoQuery, VideoQueryArgs } from "@/types/proxy";
import { log } from "@/logging";

const m3u8Prefix = "/v1/proxy/m3u8";

const addScheme = (domain: string | undefined) => {
  if (!domain || /http(s)?:\/\//.exec(domain)) {
    return domain;
  }

  if (domain.includes("://")) {
    domain = domain.split("://")?.[1];
  }

  return `https://${domain}`;
};

const getFetchOpts = (referer?: string, origin?: string) => {
  return {
    headers: {
      Referer: referer,
      Origin: origin,
      "User-Agent": config.utility.userAgent,
    },
    redirect: "follow",
  } as RequestInit;
};

function fixQueryArgs({ referer, origin, url, force, format }: VideoQuery, updateForM3U8 = false) {
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

  url = addScheme(url)!;
  referer = decodeURIComponent(addScheme(referer) ?? "");
  origin = decodeURIComponent(addScheme(origin) ?? "");
  return {
    referer,
    origin,
    url,
    force,
  };
}

async function fetchMedia(mediaUrl: URL, referer?: string, origin?: string) {
  try {
    return await fetch(mediaUrl, getFetchOpts(referer, origin));
  } catch (err) {
    throw new InvalidMediaFile((err as Error)?.message);
  }
}

async function proxyVideo(fileRegex: RegExp, { query }: VideoQueryArgs) {
  const { referer, origin, url, force } = fixQueryArgs(query);
  if (!URL.canParse(url)) {
    throw new InvalidMediaFile("unsupported URL");
  }

  if (!force && !fileRegex.test(url)) {
    throw new InvalidMediaFile("unsupported URL");
  }

  const response = await fetchMedia(new URL(url), referer, origin);
  if (!response.headers.get("Content-Type")?.includes("video/")) {
    log.warn(
      {
        url,
        headers: response.headers,
        status: response.status,
      },
      "Fetched media file with unknown video format",
    );
    throw new UnknownVideoFormat();
  }

  response.headers.delete("Access-Control-Allow-Origin");
  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
}

async function proxyM3U8({ query, headers: { host } }: M3U8QueryArgs) {
  // eslint-disable-next-line prefer-const
  let { referer, origin, url } = fixQueryArgs(query, true);
  const { all } = query;

  if (!URL.canParse(url)) {
    throw new InvalidMediaFile("unsupported URL");
  }

  const mediaUrl = new URL(url);
  if (!mediaUrl.pathname.endsWith(".m3u8") && !mediaUrl.pathname.endsWith(".ts")) {
    throw new UnknownVideoFormat();
  }

  const response = await fetchMedia(mediaUrl, referer, origin);
  if (!mediaUrl.pathname.endsWith(".m3u8")) {
    if (!response.headers.get("Content-Type")?.includes("video/")) {
      throw new UnknownVideoFormat();
    }

    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  }

  let modifiedM3u8 = await response.text();
  const targetFilename = url.replace(/([^/]+\.m3u8)/, "").trim();
  const encodedTarget = encodeURIComponent(targetFilename);
  const encodedUrl = encodeURIComponent(referer);
  const encodedOrigin = encodeURIComponent(origin);
  modifiedM3u8 = modifiedM3u8
    .split("\n")
    .map((line) => {
      if (line.startsWith("#") || line.trim() == "") {
        return line;
      }

      if (all && line.startsWith("http")) {
        // https://yourproxy.com/?url=https://somevideo.m3u8&all=yes
        const schema = config.server.isSupportHttps ? "https://" : "http://";
        return `${schema}${host}${m3u8Prefix}?url=${line}`;
      }

      const originParam = origin ? `&origin=${encodedOrigin}` : "";
      const refererParam = referer ? `&referer=${encodedUrl}` : "";
      const allParam = all ? `&all=${all}` : "";
      return `${m3u8Prefix}?url=${encodedTarget}${line}${originParam}${refererParam}${allParam}`;
    })
    .join("\n");

  response.headers.delete("Access-Control-Allow-Origin");
  return new Response(modifiedM3u8 ?? response.body, {
    status: response.status,
    headers: response.headers,
  });
}

export default new Elysia().group("/proxy", (app) =>
  app
    .use(mediaProxyModels)
    .get("/video.mp4", async (ctx) => await proxyVideo(/\.mp4/, ctx), {
      query: "mp4-proxy-model",
      detail: {
        summary: "Proxying a .mp4 video file",
        tags: ["Proxy"],
      },
    })
    .get("/video.webm", async (ctx) => await proxyVideo(/\.webm/, ctx), {
      query: "webm-proxy-model",
      detail: {
        summary: "Proxying a .webm video file",
        tags: ["Proxy"],
      },
    })
    .get("/m3u8", proxyM3U8, {
      query: "m3u8-proxy-model",
      detail: {
        summary: "Proxying a .m3u8 stream",
        tags: ["Proxy"],
      },
    }),
);
