import { afterAll, describe, expect, test } from "bun:test";
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

describe("Proxy MP4 with generic content-type", () => {
  const CONTENT_TYPES: Record<string, string> = {
    octet: "binary/octet-stream",
    "app-octet": "application/octet-stream",
  };
  const server = Bun.serve({
    port: 0,
    fetch(req) {
      const [, type] = new URL(req.url).pathname.split("/");
      return new Response("not a real video", {
        headers: { "content-type": CONTENT_TYPES[type] ?? "text/html" },
      });
    },
  });
  const origin = `http://localhost:${server.port}`;

  afterAll(() => server.stop(true));

  test("binary/octet-stream", async () => {
    const { status, headers } = await api.v1.proxy["video.mp4"].get({
      query: { url: encodeURIComponent(`${origin}/octet/video.mp4`) },
    });

    expect(status).toBe(200);
    expect((headers as Headers).get("content-type")).toBe("video/mp4");
  });
  test("application/octet-stream as webm", async () => {
    const { status, headers } = await api.v1.proxy["video.webm"].get({
      query: { url: encodeURIComponent(`${origin}/app-octet/video.webm`) },
    });

    expect(status).toBe(200);
    expect((headers as Headers).get("content-type")).toBe("video/webm");
  });
  test("text/html is rejected", async () => {
    const { status } = await api.v1.proxy["video.mp4"].get({
      query: { url: encodeURIComponent(`${origin}/page/video.mp4`) },
    });

    expect(status).toBe(400);
  });
});
