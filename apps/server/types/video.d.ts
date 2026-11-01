export type CreateVideoResponse = {
  id: string;
  polling_url: string;
  status: string;
  error?: string;
};

export type PollVideoResponse = {
  status: "queued" | "running" | "completed" | "failed" | string;
  unsigned_urls?: string[];
  error?: string;
};