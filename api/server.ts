import { z } from "zod";
import { initializeMcpApiHandler } from "../lib/mcp-api-handler";
import { getTreeHouseProtocolSummary } from "../lib/get-protocol";
import { getTokenPrice } from "../lib/get-token-prices";
import { getHistoricalTVL } from "../lib/get-tvl";
import { getMerchantMoeSummary } from "../lib/get-protocol";
import { getStablecoinData } from "../lib/get-stablecoin";
import { getFans } from "../lib/RecoupAPI/fans";
import { getPosts } from "../lib/RecoupAPI/posts";
import { TOOL_CONFIGS } from "../lib/toolConfigs";

const handler = initializeMcpApiHandler(
  (server) => {
    // Token price tool
    server.tool(
      TOOL_CONFIGS.GET_TOKEN_PRICE.name,
      TOOL_CONFIGS.GET_TOKEN_PRICE.description,
      TOOL_CONFIGS.GET_TOKEN_PRICE.parameters,
      async ({ contract_address }) => {
        const price = await getTokenPrice(contract_address);
        return {
          content: [
            { type: "text", text: `Price of ${price.symbol}: ${price.price}` },
          ],
        };
      }
    );

    // LTV tool
    server.tool(
      TOOL_CONFIGS.GET_LTV.name,
      TOOL_CONFIGS.GET_LTV.description,
      TOOL_CONFIGS.GET_LTV.parameters,
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

    // Merchant Moe tool
    server.tool(
      TOOL_CONFIGS.GET_MERCHANT_MOE.name,
      TOOL_CONFIGS.GET_MERCHANT_MOE.description,
      TOOL_CONFIGS.GET_MERCHANT_MOE.parameters,
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

    // Treehouse tool
    server.tool(
      TOOL_CONFIGS.GET_TREEHOUSE.name,
      TOOL_CONFIGS.GET_TREEHOUSE.description,
      TOOL_CONFIGS.GET_TREEHOUSE.parameters,
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

    // USDT TVL tool
    server.tool(
      TOOL_CONFIGS.GET_USDT_TVL.name,
      TOOL_CONFIGS.GET_USDT_TVL.description,
      TOOL_CONFIGS.GET_USDT_TVL.parameters,
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

    // USDC TVL tool
    server.tool(
      TOOL_CONFIGS.GET_USDC_TVL.name,
      TOOL_CONFIGS.GET_USDC_TVL.description,
      TOOL_CONFIGS.GET_USDC_TVL.parameters,
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

    // Fans tool
    server.tool(
      TOOL_CONFIGS.GET_FANS.name,
      TOOL_CONFIGS.GET_FANS.description,
      TOOL_CONFIGS.GET_FANS.parameters,
      async () => {
        const response = await getFans({
          artist_account_id: "10fd2b53-3fb8-4d75-bd23-f28520a3c7fc",
          page: 1,
          limit: 20,
        });
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

    // Posts tool
    server.tool(
      TOOL_CONFIGS.GET_POSTS.name,
      TOOL_CONFIGS.GET_POSTS.description,
      TOOL_CONFIGS.GET_POSTS.parameters,
      async () => {
        const response = await getPosts({
          artist_account_id: "10fd2b53-3fb8-4d75-bd23-f28520a3c7fc",
          page: 1,
          limit: 20,
        });
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
      tools: Object.fromEntries(
        Object.values(TOOL_CONFIGS).map((config) => [
          config.name,
          {
            description: config.description,
            parameters: Object.fromEntries(
              Object.entries(config.parameters).map(([key, schema]) => [
                key,
                {
                  type: schema instanceof z.ZodString ? "string" : "number",
                  description: schema.description,
                },
              ])
            ),
          },
        ])
      ),
    },
  }
);

export default handler;
