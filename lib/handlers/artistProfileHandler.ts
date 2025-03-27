import { getArtistProfile } from "../RecoupAPI/artistProfile";

export const handleGetArtistProfile = async ({
  artist_account_id,
}: {
  artist_account_id: string;
}) => {
  const response = await getArtistProfile({ artist_account_id });
  const { profile } = response;

  // Create a summary of each social media profile
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
  const overallStats =
    `Total Followers: ${profile.total_followers.toLocaleString()}\n` +
    `Total Following: ${profile.total_following.toLocaleString()}\n` +
    `Total Posts: ${profile.total_posts.toLocaleString()}\n` +
    `Last Updated: ${new Date(profile.updated_at).toLocaleString()}`;

  return {
    content: [
      {
        type: "text" as const,
        text: `Artist Profile Summary\n\nOverall Statistics:\n${overallStats}\n\nSocial Media Profiles:\n\n${profileSummaries}`,
      },
    ],
  };
};
