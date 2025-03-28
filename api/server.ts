import { z } from "zod";
import { initializeMcpApiHandler } from "../lib/mcp-api-handler";
import { handleGetFans } from "../lib/handlers/fansHandler";
import { handleGetPosts } from "../lib/handlers/postsHandler";
import { handleGetArtistProfile } from "../lib/handlers/artistProfileHandler";
import { TOOL_CONFIGS } from "../lib/toolConfigs";

const handler = initializeMcpApiHandler(
  (server) => {
    // Add global error handler
    server.server.onerror = (error) => {
      console.error("[MCP Server] Error:", error);
    };

    // Wrap tool handlers with error logging
    const wrapHandler = (handler: Function, toolName: string) => {
      return async (...args: any[]) => {
        console.log(
          `[${toolName}] Starting with args:`,
          JSON.stringify(args, null, 2)
        );
        try {
          const result = await handler(...args);
          console.log(
            `[${toolName}] Success:`,
            JSON.stringify(result, null, 2)
          );
          return result;
        } catch (error) {
          console.error(`[${toolName}] Error:`, error);
          throw error;
        }
      };
    };

    server.tool(
      TOOL_CONFIGS.GET_ARTIST_PROFILE.name,
      TOOL_CONFIGS.GET_ARTIST_PROFILE.description,
      TOOL_CONFIGS.GET_ARTIST_PROFILE.parameters,
      wrapHandler(handleGetArtistProfile, "GET_ARTIST_PROFILE")
    );

    server.tool(
      TOOL_CONFIGS.GET_FANS.name,
      TOOL_CONFIGS.GET_FANS.description,
      TOOL_CONFIGS.GET_FANS.parameters,
      wrapHandler(handleGetFans, "GET_FANS")
    );

    server.tool(
      TOOL_CONFIGS.GET_POSTS.name,
      TOOL_CONFIGS.GET_POSTS.description,
      TOOL_CONFIGS.GET_POSTS.parameters,
      wrapHandler(handleGetPosts, "GET_POSTS")
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
