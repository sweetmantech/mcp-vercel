import { z } from "zod";
import { initializeMcpApiHandler } from "../lib/mcp-api-handler";
import { getTreeHouseProtocolSummary } from "../lib/get-protocol";
import { getTokenPrice } from "../lib/get-token-prices";
import { getHistoricalTVL } from "../lib/get-tvl";
import { getMerchantMoeSummary } from "../lib/get-protocol";
import { getStablecoinData } from "../lib/get-stablecoin";
import { getFans } from "../lib/RecoupAPI/fans";
import { getPosts } from "../lib/RecoupAPI/posts";

const handler = initializeMcpApiHandler(
  (server) => {
    server.tool(
      "get-token-price",
      "Get the price of a token in mantle network",
      { contract_address: z.string() },
      async ({ contract_address }) => {
        const price = await getTokenPrice(contract_address);
        return {
          content: [
            { type: "text", text: `Price of ${price.symbol}: ${price.price}` },
          ],
        };
      }
    );
    server.tool(
      "get-ltv",
      "Get the total value locked of mantle network",
      {},
      async () => {
        const tvlData = await getHistoricalTVL();
        const latestTvl = tvlData[tvlData.length - 1].tvl;

        const oneDayAgoIndex = tvlData.length - 2;
        const oneWeekAgoIndex = tvlData.length - 8;

        const oneDayAgoTvl = tvlData[oneDayAgoIndex]?.tvl || latestTvl;
        const oneWeekAgoTvl = tvlData[oneWeekAgoIndex]?.tvl || latestTvl;

        const dailyChange = ((latestTvl - oneDayAgoTvl) / oneDayAgoTvl) * 100;
        const weeklyChange =
          ((latestTvl - oneWeekAgoTvl) / oneWeekAgoTvl) * 100;

        return {
          content: [
            {
              type: "text",
              text:
                `Current Mantle TVL: $${latestTvl.toLocaleString()}\n` +
                `24h Change: ${dailyChange.toFixed(2)}%\n` +
                `7d Change: ${weeklyChange.toFixed(2)}%`,
            },
          ],
        };
      }
    );

    server.tool(
      "get-protocol-merchant-moe-summary",
      "Get key metrics for the Merchant Moe protocol on Mantle",
      {},
      async () => {
        const summary = await getMerchantMoeSummary();

        const report = [
          `${summary.health.category} ${summary.name}`,
          `TVL: ${summary.tvl}`,
          `Health Score: ${summary.health.score}/100`,
          `Social Presence: ${summary.socialPresence.platformCount} platforms`,
          `Market Presence: ${
            summary.socialPresence.hasTwitter ? "Twitter" : ""
          } ${summary.socialPresence.hasGithub ? "Github" : ""} ${
            summary.isMultiChain ? "Multi-Chain" : "Single-Chain"
          }`,
        ].join("\n");

        return {
          content: [{ type: "text", text: report }],
        };
      }
    );

    server.tool(
      "get-protocol-treehouse-protocol-summary",
      "Get key metrics for a Tree House on Mantle",
      {},
      async () => {
        const summary = await getTreeHouseProtocolSummary();

        const report = [
          `${summary.health.category} ${summary.name}`,
          `TVL: ${summary.tvl}`,
          `Health Score: ${summary.health.score}/100`,
          `Social Presence: ${summary.socialPresence.platformCount} platforms`,
          `Market Presence: ${
            summary.socialPresence.hasTwitter ? "Twitter" : ""
          } ${summary.socialPresence.hasGithub ? "Github" : ""} ${
            summary.isMultiChain ? "Multi-Chain" : "Single-Chain"
          }`,
        ].join("\n");

        return {
          content: [{ type: "text", text: report }],
        };
      }
    );

    server.tool(
      "get-USDT-tvl",
      "Get the total value locked of USDT on Mantle",
      {},
      async () => {
        const data = await getStablecoinData(1);
        const latestTvl = data[data.length - 1].totalBridgedToUSD.peggedUSD;
        return {
          content: [
            { type: "text", text: `USDT TVL: $${latestTvl.toLocaleString()}` },
          ],
        };
      }
    );

    server.tool(
      "get-USDC-tvl",
      "Get the total value locked of USDC on Mantle",
      {},
      async () => {
        const data = await getStablecoinData(2);
        const latestTvl = data[data.length - 1].totalBridgedToUSD.peggedUSD;
        return {
          content: [
            { type: "text", text: `USDC TVL: $${latestTvl.toLocaleString()}` },
          ],
        };
      }
    );

    server.tool(
      "get_artist_fans",
      "Get a list of fans for a specific artist across all social media profiles",
      {
        artist_account_id: z
          .string()
          .describe(
            "The unique identifier of the artist account to fetch fans for"
          ),
        page: z
          .number()
          .min(1)
          .optional()
          .describe("The page number to retrieve (default: 1)"),
        limit: z
          .number()
          .min(1)
          .optional()
          .describe("The number of records per page (default: 20, max: 100)"),
      },
      async ({ artist_account_id, page, limit }) => {
        const response = await getFans({ artist_account_id, page, limit });
        const fanSummaries = response.fans
          .map(
            (fan) =>
              `${fan.username} (${fan.region}) - ${fan.followerCount} followers\n${fan.bio}`
          )
          .join("\n\n");

        return {
          content: [
            {
              type: "text",
              text: `Found ${response.pagination.total_count} fans (showing page ${response.pagination.page} of ${response.pagination.total_pages}):\n\n${fanSummaries}`,
            },
          ],
        };
      }
    );

    server.tool(
      "get_artist_posts",
      "Get a list of social media posts for a specific artist across all social media profiles",
      {
        artist_account_id: z
          .string()
          .describe(
            "The unique identifier of the artist account to fetch posts for"
          ),
        page: z
          .number()
          .min(1)
          .optional()
          .describe("The page number to retrieve (default: 1)"),
        limit: z
          .number()
          .min(1)
          .optional()
          .describe("The number of records per page (default: 20, max: 100)"),
      },
      async ({ artist_account_id, page, limit }) => {
        const response = await getPosts({ artist_account_id, page, limit });
        const postSummaries = response.posts
          .map(
            (post) =>
              `Post ID: ${post.id}\nURL: ${
                post.post_url
              }\nLast Updated: ${new Date(post.updated_at).toLocaleString()}`
          )
          .join("\n\n");

        return {
          content: [
            {
              type: "text",
              text: `Found ${response.pagination.total_count} posts (showing page ${response.pagination.page} of ${response.pagination.total_pages}):\n\n${postSummaries}`,
            },
          ],
        };
      }
    );
  },
  {
    capabilities: {
      tools: {
        "get-token-price": {
          description: "Get the price of a token in mantle network",
          parameters: {
            contract_address: { type: "string" },
          },
        },
        "get-ltv": {
          description: "Get the total value locked of mantle network",
          parameters: {},
        },
        "get-protocol-merchant-moe-summary": {
          description:
            "Get key metrics for the Merchant Moe protocol on Mantle",
          parameters: {},
        },
        "get-protocol-treehouse-protocol-summary": {
          description: "Get key metrics for a Tree House on Mantle",
          parameters: {},
        },
        "get-USDT-tvl": {
          description: "Get the total value locked of USDT on Mantle",
          parameters: {},
        },
        "get-USDC-tvl": {
          description: "Get the total value locked of USDC on Mantle",
          parameters: {},
        },
        "get-fans": {
          description: "Get a list of fans for a specific artist",
          parameters: {
            artist_account_id: {
              type: "string",
              description:
                "The unique identifier of the artist account to fetch fans for",
            },
            page: {
              type: "number",
              description: "The page number to retrieve (default: 1)",
            },
            limit: {
              type: "number",
              description:
                "The number of records per page (default: 20, max: 100)",
            },
          },
        },
        "get-posts": {
          description: "Get a list of social media posts for a specific artist",
          parameters: {
            artist_account_id: {
              type: "string",
              description:
                "The unique identifier of the artist account to fetch posts for",
            },
            page: {
              type: "number",
              description: "The page number to retrieve (default: 1)",
            },
            limit: {
              type: "number",
              description:
                "The number of records per page (default: 20, max: 100)",
            },
          },
        },
      },
    },
  }
);

export default handler;
