import Elysia, { t } from "elysia";

export default new Elysia().model({
  "mp4-proxy-model": t.Object({
    referer: t.Optional(t.String()),
    origin: t.Optional(t.String()),
    url: t.RegExp(/\.mp4/),
  }),
  "webm-proxy-model": t.Object({
    referer: t.Optional(t.String()),
    origin: t.Optional(t.String()),
    url: t.RegExp(/\.webm/),
  }),
  "m3u8-proxy-model": t.Object({
    referer: t.Optional(t.String()),
    origin: t.Optional(t.String()),
    all: t.Optional(t.Literal("yes")),
    url: t.String(),
  }),
});
