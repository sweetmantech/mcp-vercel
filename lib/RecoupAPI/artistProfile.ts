import { z } from "zod";
import { API_BASE_URL } from "./constants";

// Profile schema for individual social media profiles
export const SocialProfileSchema = z.object({
  id: z.string(),
  username: z.string(),
  profile_url: z.string().url(),
  avatar: z.string().url().nullable(),
  bio: z.string().nullable(),
  follower_count: z.number().nullable(),
  following_count: z.number().nullable(),
  post_count: z.number().nullable(),
  region: z.string().nullable(),
  updated_at: z.string().datetime(),
});

// Complete artist profile schema
export const ArtistProfileSchema = z.object({
  id: z.string(),
  profiles: z.array(SocialProfileSchema),
  total_followers: z.number(),
  total_following: z.number(),
  total_posts: z.number(),
  updated_at: z.string().datetime(),
});

// Response schema
export const ArtistProfileResponseSchema = z.object({
  status: z.enum(["success", "error"]),
  profile: ArtistProfileSchema,
});

// Query parameters schema
export const ArtistProfileQuerySchema = z.object({
  artist_account_id: z.string(),
});

// Type exports
export type SocialProfile = z.infer<typeof SocialProfileSchema>;
export type ArtistProfile = z.infer<typeof ArtistProfileSchema>;
export type ArtistProfileResponse = z.infer<typeof ArtistProfileResponseSchema>;
export type ArtistProfileQueryParams = z.infer<typeof ArtistProfileQuerySchema>;

export async function getArtistProfile(
  params: ArtistProfileQueryParams
): Promise<ArtistProfileResponse> {
  const validatedParams = ArtistProfileQuerySchema.parse(params);
  const queryParams = new URLSearchParams();
  queryParams.append("artist_account_id", validatedParams.artist_account_id);

  const response = await fetch(
    `${API_BASE_URL}/artist-profile?${queryParams.toString()}`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch artist profile: ${response.statusText}`);
  }

  const data = await response.json();

  if (data.status === "error") {
    throw new Error(data.message || "Failed to fetch artist profile");
  }

  return ArtistProfileResponseSchema.parse(data);
}
