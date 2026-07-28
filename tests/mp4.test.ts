import { describe, expect, test } from "bun:test";
import { treaty } from "@elysia/eden";
import { app } from "@/index";

const api = treaty(app);

const MEDIA_URL = "https://s3.toil.cc/vot/video.mp4";
const MEDIA_ORIGIN_URL = "https://s3.toil.cc";

describe("Proxy MP4", () => {
  test("simple", async () => {
    const { headers } = await api.v1.proxy["video.mp4"].get({
      query: {
        url: encodeURIComponent(MEDIA_URL),
      },
    });

    expect((headers as Headers).get("content-type")).toBe("video/mp4");
  });
  test("with origin and referer", async () => {
    const { headers } = await api.v1.proxy["video.mp4"].get({
      query: {
        url: encodeURIComponent(MEDIA_URL),
        origin: encodeURIComponent(MEDIA_ORIGIN_URL),
        referer: encodeURIComponent(MEDIA_ORIGIN_URL),
      },
    });

    expect((headers as Headers).get("content-type")).toBe("video/mp4");
  });
  test("with format=base64", async () => {
    const { headers } = await api.v1.proxy["video.mp4"].get({
      query: {
        format: "base64",
        url: btoa(MEDIA_URL),
        origin: encodeURIComponent(MEDIA_ORIGIN_URL),
        referer: encodeURIComponent(MEDIA_ORIGIN_URL),
      },
    });

    expect((headers as Headers).get("content-type")).toBe("video/mp4");
  });
});
