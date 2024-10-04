export class InvalidMediaFile extends Error {
  constructor(public reason: string) {
    if (reason.includes("Is the computer able to access the url")) {
      reason = "invalid URL was passed";
    }

    super(`Invalid media file, because: ${reason}`);
  }
}

export class UnknownVideoFormat extends Error {
  constructor() {
    super("Unknown video format");
  }
}
