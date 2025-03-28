import { z } from "zod";

export const RecoupTools = {
  GET_ARTIST_PROFILE: {
    name: "get_artist_profile",
    description:
      "Get comprehensive profile information for an artist across all connected social media platforms",
    parameters: {
      artist_account_id: z.string(),
    },
  },
  GET_FANS: {
    name: "get_artist_fans",
    description:
      "Get a list of fans for a specific artist across all social media profiles",
    parameters: {
      artist_account_id: z.string(),
    },
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
