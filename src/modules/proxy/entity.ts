import { t } from "elysia";

const ForceType = t.Boolean({ default: false });
export type ForceType = typeof ForceType.static;

const FormatType = t.Union([t.Literal("base64"), t.Literal("url")]);
export type FormatType = typeof FormatType.static;

export const ProxyOpts = t.Object({
  url: t.String(),
  referer: t.Optional(t.String()),
  origin: t.Optional(t.String()),
  format: t.Optional(FormatType),
});

export const VideoProxyOpts = t.Composite([
  ProxyOpts,
  t.Object({
    force: t.Optional(ForceType),
    headers: t.Optional(t.String()),
  }),
]);
export type VideoProxyOpts = typeof VideoProxyOpts.static;

export const M3U8ProxyOpts = t.Composite([
  ProxyOpts,
  t.Object({ all: t.Optional(t.Literal("yes")), force: t.Optional(ForceType) }),
]);
export type M3U8ProxyOpts = typeof M3U8ProxyOpts.static;
