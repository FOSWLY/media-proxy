import { describe, expect, test } from "bun:test";
import { treaty } from "@elysia/eden";
import { app } from "@/index";
import { ProxyService } from "@/modules/proxy/service";

const api = treaty(app);

const MEDIA_URL = encodeURIComponent("https://s3.toil.cc/hls/1080_out.m3u8");
const MEDIA_FRAGMENT_URL = encodeURIComponent(
  "https://s3.toil.cc/hls/1080_out0.ts",
);
const MEDIA_ORIGIN_URL = encodeURIComponent("https://s3.toil.cc");

describe("Proxy M3U8", () => {
  test("simple", async () => {
    const { data } = await api.v1.proxy["m3u8"].get({
      query: {
        url: MEDIA_URL,
        all: "yes",
      },
    });

    const content = data as unknown as string;
    expect(content).toContain(MEDIA_FRAGMENT_URL);
  });
  test("with origin and referer", async () => {
    const { data } = await api.v1.proxy["m3u8"].get({
      query: {
        url: MEDIA_URL,
        all: "yes",
        origin: MEDIA_ORIGIN_URL,
        referer: MEDIA_ORIGIN_URL,
      },
    });

    const content = data as unknown as string;
    expect(content).toContain(MEDIA_FRAGMENT_URL);
    const expectedQueryOpts = new URLSearchParams({
      url: decodeURIComponent(MEDIA_FRAGMENT_URL),
      origin: decodeURIComponent(MEDIA_ORIGIN_URL),
      referer: decodeURIComponent(MEDIA_ORIGIN_URL),
      all: "yes",
    }).toString();
    expect(content).toContain(
      `${ProxyService.M3U8_PREFIX}?${expectedQueryOpts}`,
    );
  });

  test("get fragment", async () => {
    const { status } = await api.v1.proxy["m3u8"].get({
      query: {
        url: MEDIA_FRAGMENT_URL,
      },
    });

    expect(status).toBe(200);
  });
});
