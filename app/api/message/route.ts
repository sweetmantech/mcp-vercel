import { initializeMcpApiHandler } from "@/lib/MCP/mcp-api-handler";
import { NextRequest } from "next/server";

const handler = initializeMcpApiHandler(
  () => {
    // The server configuration is shared with the SSE handler
  },
  {
    capabilities: {
      tools: {
        // Tools are configured in the SSE handler
      },
    },
  }
);

export async function POST(req: NextRequest) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return handler(req as any, new Response() as any);
}
