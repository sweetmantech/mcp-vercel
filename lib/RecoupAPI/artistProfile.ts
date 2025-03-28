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
  // Use Response.json() for structured logging
  const log = (level: string, message: string, data?: any) => {
    console.log(
      JSON.stringify({
        level,
        message,
        data,
        timestamp: new Date().toISOString(),
        service: "artist-profile",
      })
    );
  };

  log("info", "Starting getArtistProfile", { params });

  try {
    const validatedParams = ArtistProfileQuerySchema.parse(params);
    log("info", "Params validation successful");

    const queryParams = new URLSearchParams();
    queryParams.append("artist_account_id", validatedParams.artist_account_id);
    const url = `${API_BASE_URL}/artist-profile?${queryParams.toString()}`;
    log("info", "Making API request", { url });

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    log("info", "Received API response", {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch artist profile: ${response.statusText}`);
    }

    const data = await response.json();
    log("info", "Received API data", { data });

    if (data.status === "error") {
      throw new Error(data.message || "Failed to fetch artist profile");
    }

    const parsedData = ArtistProfileResponseSchema.parse(data);
    log("info", "Schema validation successful");

    return parsedData;
  } catch (error) {
    log("error", "Error in getArtistProfile", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      validation: error instanceof z.ZodError ? error.errors : undefined,
    });
    throw error;
  }
}
