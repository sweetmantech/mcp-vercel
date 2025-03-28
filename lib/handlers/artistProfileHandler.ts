import { getArtistProfile } from "../RecoupAPI/artistProfile";

export const handleGetArtistProfile = async ({
  artist_account_id,
}: {
  artist_account_id: string;
}) => {
  console.log(
    "[handleGetArtistProfile] Starting with artist_account_id:",
    artist_account_id
  );

  try {
    console.log("[handleGetArtistProfile] Calling getArtistProfile");
    const response = await getArtistProfile({ artist_account_id });
    console.log("[handleGetArtistProfile] Got response from getArtistProfile");

    const { profile } = response;
    console.log(
      "[handleGetArtistProfile] Profile data:",
      JSON.stringify(profile, null, 2)
    );

    // Create a summary of each social media profile
    console.log("[handleGetArtistProfile] Creating profile summaries");
    const profileSummaries = profile.profiles
      .map(
        (p) =>
          `Platform: ${new URL(p.profile_url).hostname}\n` +
          `Username: ${p.username}\n` +
          `Profile: ${p.profile_url}\n` +
          `Bio: ${p.bio || "N/A"}\n` +
          `Followers: ${p.follower_count?.toLocaleString() || "N/A"}\n` +
          `Following: ${p.following_count?.toLocaleString() || "N/A"}\n` +
          `Posts: ${p.post_count?.toLocaleString() || "N/A"}\n` +
          `Region: ${p.region || "N/A"}`
      )
      .join("\n\n");

    // Create overall statistics summary
    console.log("[handleGetArtistProfile] Creating overall stats");
    const overallStats =
      `Total Followers: ${profile.total_followers.toLocaleString()}\n` +
      `Total Following: ${profile.total_following.toLocaleString()}\n` +
      `Total Posts: ${profile.total_posts.toLocaleString()}\n` +
      `Last Updated: ${new Date(profile.updated_at).toLocaleString()}`;

    const result = {
      content: [
        {
          type: "text" as const,
          text: `Artist Profile Summary\n\nOverall Statistics:\n${overallStats}\n\nSocial Media Profiles:\n\n${profileSummaries}`,
        },
      ],
    };

    console.log(
      "[handleGetArtistProfile] Returning result:",
      JSON.stringify(result, null, 2)
    );
    return result;
  } catch (error) {
    console.error("[handleGetArtistProfile] Error:", error);
    // Re-throw the error to be handled by MCP server
    throw error;
  }
};
