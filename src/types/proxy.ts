export type VideoQuery = {
  referer?: string;
  origin?: string;
  force?: boolean;
  format?: "base64" | "url";
  url: string;
};

export interface M3U8Query extends VideoQuery {
  all?: "yes";
}

export type VideoQueryArgs = { query: VideoQuery };
export type M3U8QueryArgs = { query: M3U8Query; headers: Record<string, string> };
