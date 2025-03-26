import { z } from "zod";
import { PaginationParams } from "./pagination";

export const RecoupTools = {
  GET_FANS: {
    name: "get_artist_fans",
    description:
      "Get a list of fans for a specific artist across all social media profiles",
    parameters: {
      artist_account_id: z
        .string()
        .describe(
          "The unique identifier of the artist account to fetch fans for"
        ),
      ...PaginationParams,
    },
  },
  GET_POSTS: {
    name: "get_artist_posts",
    description:
      "Get a list of social media posts for a specific artist across all social media profiles",
    parameters: {
      artist_account_id: z
        .string()
        .describe(
          "The unique identifier of the artist account to fetch posts for"
        ),
      ...PaginationParams,
    },
  },
} as const;
