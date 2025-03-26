import { z } from "zod";
import { API_BASE_URL, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "./constants";

export const FanSchema = z.object({
  id: z.string(),
  username: z.string(),
  avatar: z.string().url(),
  profile_url: z.string().url(),
  region: z.string(),
  bio: z.string(),
  followerCount: z.number(),
  followingCount: z.number(),
  updated_at: z.string().datetime(),
});

export type Fan = z.infer<typeof FanSchema>;

export const FanQuerySchema = z.object({
  artist_account_id: z.string(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
});

export type FanQueryParams = z.infer<typeof FanQuerySchema>;

export interface FanPagination {
  total_count: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface FanResponse {
  status: "success" | "error";
  fans: Fan[];
  pagination: FanPagination;
}

export async function getFans(params: FanQueryParams): Promise<FanResponse> {
  const validatedParams = FanQuerySchema.parse(params);
  const queryParams = new URLSearchParams();

  queryParams.append("artist_account_id", validatedParams.artist_account_id);
  queryParams.append("page", validatedParams.page.toString());
  queryParams.append("limit", validatedParams.limit.toString());

  const response = await fetch(
    `${API_BASE_URL}/fans?${queryParams.toString()}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch fans: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.status === "error") {
    throw new Error(data.message || "Failed to fetch fans");
  }

  return data;
}
