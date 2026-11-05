export type CreateVideoResponse = {
  id: string;
  polling_url: string;
  status: "pending" | "in_progress" ;
  error?: string;
};

export type PollVideoResponse = {
  id?: string,
  polling_url?: string,
  status: "pending" | "in_progress" | "completed" | "failed" | "cancelled" | "expired";
  unsigned_urls?: string[];
  error?: string;
  usage?:{
    cost?: number;
    is_byok?: boolean;
  }
};