import { z } from "zod";
import { initializeMcpApiHandler } from "../lib/mcp-api-handler";
import { handleGetFans } from "../lib/handlers/fansHandler";
import { handleGetPosts } from "../lib/handlers/postsHandler";
import { TOOL_CONFIGS } from "../lib/toolConfigs";

const handler = initializeMcpApiHandler(
  (server) => {
    server.tool(
      TOOL_CONFIGS.GET_FANS.name,
      TOOL_CONFIGS.GET_FANS.description,
      TOOL_CONFIGS.GET_FANS.parameters,
      handleGetFans
    );
    server.tool(
      TOOL_CONFIGS.GET_POSTS.name,
      TOOL_CONFIGS.GET_POSTS.description,
      TOOL_CONFIGS.GET_POSTS.parameters,
      handleGetPosts
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
