import { clearHeaders } from "@/shared/request";
import { M3U8ProxyOpts, VideoProxyOpts } from "./entity";
import { InvalidMediaFile, UnknownVideoFormat } from "./error";
import { fetchMedia, fixQueryArgs } from "./utils";
import { log } from "@/logging";
import config from "@/shared/config";

export abstract class ProxyService {
  static M3U8_PREFIX = "/v1/proxy/m3u8";
  static SCHEMA = config.server.isSupportHttps ? "https://" : "http://";

  static async proxyVideo(fileRegex: RegExp, query: VideoProxyOpts) {
    const { referer, origin, url, force, headers } = fixQueryArgs(query);
    if (!URL.canParse(url)) {
      throw new InvalidMediaFile("unsupported URL");
    }

    if (!force && !fileRegex.test(url)) {
      throw new InvalidMediaFile("unsupported URL");
    }

    const response = await fetchMedia(new URL(url), referer, origin, headers);
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

    return new Response(response.body, {
      status: response.status,
      headers: clearHeaders(response.headers),
    });
  }

  static async proxyM3U8(
    query: M3U8ProxyOpts,
    { host }: Record<string, string | undefined>,
  ) {
    // eslint-disable-next-line prefer-const
    let { referer, origin, url } = fixQueryArgs(query, true);
    const { all } = query;

    if (!URL.canParse(url)) {
      throw new InvalidMediaFile("unsupported URL");
    }

    const mediaUrl = new URL(url);
    if (
      !mediaUrl.pathname.endsWith(".m3u8") &&
      !mediaUrl.pathname.endsWith(".ts")
    ) {
      throw new UnknownVideoFormat();
    }

    const response = await fetchMedia(mediaUrl, referer, origin);
    const responseHeaders = clearHeaders(response.headers);

    if (mediaUrl.pathname.endsWith(".ts")) {
      return new Response(response.body, {
        status: response.status,
        headers: responseHeaders,
      });
    }

    let modifiedM3u8 = await response.text();
    const targetFilename = url.replace(/([^/]+\.m3u8)/, "").trim();
    modifiedM3u8 = modifiedM3u8
      .split("\n")
      .map((line) => {
        if (line.startsWith("#") || line.trim() == "") {
          return line;
        }

        if (all && line.startsWith("http")) {
          // https://yourproxy.com/?url=https://somevideo.m3u8&all=yes
          return `${this.SCHEMA}${host}${this.M3U8_PREFIX}?url=${line}`;
        }

        // autoencodes all fields
        const params = new URLSearchParams({
          url: `${targetFilename}${line}`,
        });
        if (origin) {
          params.append("origin", origin);
        }
        if (referer) {
          params.append("referer", referer);
        }
        if (all) {
          params.append("all", all);
        }

        return `${this.M3U8_PREFIX}?${params.toString()}`;
      })
      .join("\n");

    return new Response(modifiedM3u8 ?? response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  }
}
