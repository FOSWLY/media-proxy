import Elysia from "elysia";
import { ProxyModel } from "./model";
import { ProxyService } from "./service";

export default new Elysia({
  tags: ["Proxy"],
}).group("/proxy", (app) =>
  app
    .get(
      "/video.mp4",
      async ({ query }) => {
        return await ProxyService.proxyVideo(/\.mp4/, query);
      },
      {
        query: ProxyModel.getMP4Query,
        detail: {
          summary: "Proxying a .mp4 video file",
        },
      },
    )
    .get(
      "/video.webm",
      async ({ query }) => {
        return await ProxyService.proxyVideo(/\.webm/, query);
      },
      {
        query: ProxyModel.getWebmQuery,
        detail: {
          summary: "Proxying a .webm video file",
        },
      },
    )
    .get(
      "/m3u8",
      ({ query, headers }) => {
        return ProxyService.proxyM3U8(query, headers);
      },
      {
        query: ProxyModel.getM3U8Query,
        detail: {
          summary: "Proxying a .m3u8 stream",
        },
      },
    ),
);
