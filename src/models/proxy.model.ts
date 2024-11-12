import Elysia, { Static, t } from "elysia";

const ForceType = t.Boolean({ default: false });
export type ForceType = Static<typeof ForceType>;

const FormatType = t.Union([t.Literal("base64"), t.Literal("url")]);
export type FormatType = Static<typeof FormatType>;

export default new Elysia().model({
  "mp4-proxy-model": t.Object({
    referer: t.Optional(t.String()),
    origin: t.Optional(t.String()),
    force: t.Optional(ForceType),
    format: t.Optional(FormatType),
    url: t.String(),
  }),
  "webm-proxy-model": t.Object({
    referer: t.Optional(t.String()),
    origin: t.Optional(t.String()),
    force: t.Optional(ForceType),
    format: t.Optional(FormatType),
    url: t.String(),
  }),
  "m3u8-proxy-model": t.Object({
    referer: t.Optional(t.String()),
    origin: t.Optional(t.String()),
    all: t.Optional(t.Literal("yes")),
    force: t.Optional(ForceType),
    format: t.Optional(FormatType),
    url: t.String(),
  }),
});
