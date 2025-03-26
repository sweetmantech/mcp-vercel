import { z } from "zod";
import { API_BASE_URL, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "./constants";

// Post data schema
export const PostSchema = z.object({
  id: z.string(),
  post_url: z.string().url(),
  updated_at: z.string().datetime(),
});

export type Post = z.infer<typeof PostSchema>;

// Query parameters schema
export const PostQuerySchema = z.object({
  artist_account_id: z.string(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
});

export type PostQueryParams = z.infer<typeof PostQuerySchema>;

export interface PostPagination {
  total_count: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface PostResponse {
  status: "success" | "error";
  posts: Post[];
  pagination: PostPagination;
}

export async function getPosts(params: PostQueryParams): Promise<PostResponse> {
  const validatedParams = PostQuerySchema.parse(params);
  const queryParams = new URLSearchParams();

  queryParams.append("artist_account_id", validatedParams.artist_account_id);
  queryParams.append("page", validatedParams.page.toString());
  queryParams.append("limit", validatedParams.limit.toString());

  const response = await fetch(
    `${API_BASE_URL}/posts?${queryParams.toString()}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        // Add authentication headers when available
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.status === "error") {
    throw new Error(data.message || "Failed to fetch posts");
  }

  return data;
}
