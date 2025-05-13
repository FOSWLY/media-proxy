## 1.1.4

- Fixed merge cors headers with headers from original response
- Migrated to `@elysiajs/cors`
- Bump depends

## 1.1.3

- Added support base64-encoded `headers` query param for mp4/webm video proxying
- Removed duplicated `Date` header for mp4/webm video proxying
- Lib `pino` replaced with `@vaylo/pino`

## 1.1.2

- Added option to disable save logs to file
- Removed decode url for base64 format
- Updated depends

## 1.1.1

- Added logging media file with unknown video format

## 1.1.0

- Added `force` param to proxy a link, even if it doesn't meet the criteria (the link should still be parsed through the URL.canParse)
- Added support base64 encoded url param (if param `format` equal `base64`)
- Changed logic of check url file type part
- Removed sonarjs
- Updated dependencies

## 1.0.1

- Fixed fetch non `.m3u8` and `.ts` file types on proxy `v1/proxy/m3u8` (maybe)
- Added Typebox config schema
- Added auto-fix broken protocol name
