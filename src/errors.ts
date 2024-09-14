export class InvalidMediaFile extends Error {
  constructor(public message: string) {
    super(`Invalid media file. Error: ${message}`);
  }
}
