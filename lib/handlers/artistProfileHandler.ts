import { getArtistProfile } from "../RecoupAPI/artistProfile";

const log = (level: string, message: string, data?: any) => {
  console.log(
    JSON.stringify({
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      service: "artist-profile-handler",
    })
  );
};

export const handleGetArtistProfile = async ({
  artist_account_id,
}: {
  artist_account_id: string;
}) => {
  log("info", "Starting handleGetArtistProfile", { artist_account_id });

  try {
    log("info", "Calling getArtistProfile");
    const response = await getArtistProfile({ artist_account_id });
    log("info", "Got response from getArtistProfile");

    const { profile } = response;
    log("info", "Processing profile data", { profile });

    // Create a summary of each social media profile
    log("info", "Creating profile summaries");
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
    log("info", "Creating overall stats");
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

    log("info", "Returning result", { result });
    return result;
  } catch (error) {
    log("error", "Error in handleGetArtistProfile", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};
