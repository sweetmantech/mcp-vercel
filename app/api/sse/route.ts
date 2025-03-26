import { initializeMcpApiHandler } from "@/app/lib/mcp-api-handler";
import { z } from "zod";
import { NextRequest } from "next/server";

const handler = initializeMcpApiHandler(
  (server) => {
    // Example tool registration - you can customize these based on your needs
    server.tool(
      "example-tool",
      "An example tool that demonstrates the functionality",
      { param: z.string() },
      async ({ param }) => {
        return {
          content: [
            { type: "text", text: `Example response with param: ${param}` },
          ],
        };
      }
    );
  },
  {
    capabilities: {
      tools: {
        "example-tool": {
          description: "An example tool that demonstrates the functionality",
          parameters: {
            param: { type: "string" },
          },
        },
      },
    },
  }
);

export async function GET(req: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return handler(req as any, new Response() as any);
}

export async function POST(req: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return handler(req as any, new Response() as any);
}
