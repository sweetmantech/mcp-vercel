import { z } from "zod";
import { initializeMcpApiHandler } from "../lib/mcp-api-handler";
import { handleGetFans } from "../lib/handlers/fansHandler";
import { handleGetPosts } from "../lib/handlers/postsHandler";
import { handleGetArtistProfile } from "../lib/handlers/artistProfileHandler";
import { TOOL_CONFIGS } from "../lib/toolConfigs";

const log = (level: string, message: string, data?: any) => {
  console.log(
    JSON.stringify({
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      service: "mcp-server",
    })
  );
};

const handler = initializeMcpApiHandler(
  (server) => {
    // Add global error handler
    server.server.onerror = (error) => {
      log("error", "MCP Server Error", {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
    };

    // Wrap tool handlers with error logging
    const wrapHandler = (handler: Function, toolName: string) => {
      return async (...args: any[]) => {
        log("info", `Starting ${toolName}`, { args });
        try {
          const result = await handler(...args);
          log("info", `${toolName} succeeded`, { result });
          return result;
        } catch (error) {
          log("error", `${toolName} failed`, {
            error: error instanceof Error ? error.message : "Unknown error",
            stack: error instanceof Error ? error.stack : undefined,
          });
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
