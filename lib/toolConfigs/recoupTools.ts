import { z } from "zod";

export const RecoupTools = {
  GET_FANS: {
    name: "get_artist_fans",
    description:
      "Get a list of fans for the test artist across all social media profiles",
    parameters: {},
  },
  GET_POSTS: {
    name: "get_artist_posts",
    description:
      "Get a list of social media posts for a specific artist across all social media profiles",
    parameters: {
      artist_account_id: z.string(),
    },
  },
} as const;
