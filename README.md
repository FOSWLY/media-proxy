# Media Proxy

Простой прокси сервер для проксирования видео или m3u8 стримов.

Необходим для видео, которые находятся на заблокированных доменах или которые Яндекс не может перевести т.к. имя файла находится не в пути (`/video.mp4`), а в параметрах ссылки (`/?file=video.mp4`). Так же, может использоваться для стримов возвращаемых Яндексом.

## Поддерживаемые форматы

Поддерживается проксирование `.mp4`, `.webm`, `.m3u8`, `.ts`.

### Параметры

- `url`: url-safe ссылка на видео, либо ссылка в формате base64 (если указан параметр `format=base64`)

### Опциональные параметры

- `format`: тип ссылки, может быть `base64` или `url`
- `referer`: заголовок Referer
- `origin`: заголовок Origin

Опциональные для mp4 / webm:

- `force`: игнорировать проверку на наличие .mp4 или .webm в ссылке
- `headers`: base64-encoded JSON с заголовками, которые будут добавлены к запросу на проксируемый ресурс

Опциональные для mp4 / webm:

- `all`: проксировать весь контент из m3u8

## Пример использования

#### Проксирование mp4

Проксирование с помощью ссылки (url-safe)

```bash
https://YOUR_DOMAIN/v1/proxy/video.mp4?url=https%3A%2F%2Fs3.toil.cc%2Fvot%2Fvideo.mp4
```

Проксирование с помощью ссылки (base64)

```bash
https://YOUR_DOMAIN/v1/proxy/video.mp4?format=base64&url=aHR0cHM6Ly9zMy50b2lsLmNjL3ZvdC92aWRlby5tcDQ=
```

#### Проксирование m3u8

Поддерживает проксирование как `.m3u8` файлов, так и `.ts` сегментов. В ссылке должен быть явно указан формат файла, иначе сервер выдаст ошибку `{"error":"Unknown video format"}`

Проксирование с помощью ссылки (url-safe) с проксированием всех сегментов

```bash
https://YOUR_DOMAIN/v1/proxy/m3u8?all=yes&origin=ORIGIN_FROM_YOUR_URL&referer=REFERER_FROM_YOUR_URL&url=YOUR_FULL_URL
```

Проксирование определенного сегмента m3u8 с помощью ссылки (url-safe)

```bash
https://YOUR_DOMAIN/v1/proxy/m3u8?origin=ORIGIN_FROM_YOUR_URL&referer=REFERER_FROM_YOUR_URL&url=YOUR_FULL_URL
```

## Запуск сервера

1. Установите [Bun](https://bun.sh/)
2. Установите зависимости с помощью команды

```bash
bun install
```

3. Запустите сервер

```bash
bun start
```

4. Если вы собираетесь использовать прокси сервер без https, не забудьте добавить `IS_SUPPORT_HTTPS=false` в `.env` файл
