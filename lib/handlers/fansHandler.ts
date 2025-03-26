import { getFans } from "../RecoupAPI/fans";

export const handleGetFans = async ({
  artist_account_id,
}: {
  artist_account_id: string;
}) => {
  const firstPage = await getFans({
    artist_account_id,
    page: 1,
    limit: 20,
  });

  const totalPages = firstPage.pagination.total_pages;
  let allFans = [...firstPage.fans];

  for (let page = 2; page <= totalPages; page++) {
    const response = await getFans({
      artist_account_id,
      page,
      limit: 20,
    });
    allFans = [...allFans, ...response.fans];
  }

  const fanSummaries = allFans
    .map(
      (fan) =>
        `${fan.username} (${fan.region}) - ${fan.followerCount} followers\n${fan.bio}`
    )
    .join("\n\n");

  return {
    content: [
      {
        type: "text" as const,
        text: `Found ${allFans.length} total fans across ${totalPages} pages:\n\n${fanSummaries}`,
      },
    ],
  };
};
