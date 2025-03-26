import { initializeMcpApiHandler } from "@/app/lib/mcp-api-handler";
import { NextRequest } from "next/server";

const handler = initializeMcpApiHandler(
  (server) => {
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
  return handler(req as any, new Response() as any);
}
