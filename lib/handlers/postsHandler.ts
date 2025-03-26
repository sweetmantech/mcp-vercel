import { getPosts } from "../RecoupAPI/posts";

export const handleGetPosts = async ({
  artist_account_id,
}: {
  artist_account_id: string;
}) => {
  const firstPage = await getPosts({
    artist_account_id,
    page: 1,
    limit: 20,
  });

  const totalPages = firstPage.pagination.total_pages;
  let allPosts = [...firstPage.posts];

  for (let page = 2; page <= totalPages; page++) {
    const response = await getPosts({
      artist_account_id,
      page,
      limit: 20,
    });
    allPosts = [...allPosts, ...response.posts];
  }

  const postSummaries = allPosts
    .map(
      (post) =>
        `Post ID: ${post.id}\nURL: ${post.post_url}\nLast Updated: ${new Date(
          post.updated_at
        ).toLocaleString()}`
    )
    .join("\n\n");

  return {
    content: [
      {
        type: "text" as const,
        text: `Found ${allPosts.length} total posts across ${totalPages} pages:\n\n${postSummaries}`,
      },
    ],
  };
};
