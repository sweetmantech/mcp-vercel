import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { kv } from "@vercel/kv";
import { ServerOptions } from "@modelcontextprotocol/sdk/server/index.js";

interface SerializedRequest {
  requestId: string;
  url: string;
  method: string;
  body: string;
  headers: Headers;
}

export function initializeEdgeMcpHandler(
  initializeServer: (server: McpServer) => void,
  serverOptions: ServerOptions = {}
) {
  let servers: McpServer[] = [];

  return async function mcpEdgeHandler(req: Request): Promise<Response> {
    const url = new URL(req.url);

    if (url.pathname === "/api/sse") {
      const stream = new TransformStream();
      const writer = stream.writable.getWriter();

      const transport = new SSEServerTransport("/api/message", {
        write: (chunk: unknown) => {
          if (typeof chunk === "string") {
            writer.write(new TextEncoder().encode(chunk));
          }
          return true;
        },
        end: () => writer.close(),
      } as any);
      const sessionId = transport.sessionId;
      const server = new McpServer(
        {
          name: "mcp-typescript server on vercel edge",
          version: "0.1.0",
        },
        serverOptions
      );

      initializeServer(server);
      servers.push(server);

      server.server.onclose = () => {
        console.log("SSE connection closed");
        servers = servers.filter((s) => s !== server);
      };

      // Subscribe to messages for this session
      const messageChannel = new BroadcastChannel(`requests:${sessionId}`);
      messageChannel.onmessage = async (event) => {
        const request = event.data as SerializedRequest;
        const syntheticReq = new Request(request.url, {
          method: request.method,
          headers: request.headers,
          body: request.body,
        });

        const responseStream = new TransformStream();
        const writer = responseStream.writable.getWriter();

        try {
          await transport.handlePostMessage(syntheticReq, {
            write: async (chunk: string) => {
              await writer.write(new TextEncoder().encode(chunk));
            },
            end: () => writer.close(),
          } as any);
        } catch (error) {
          console.error("Error handling message:", error);
          await kv.publish(
            `responses:${sessionId}:${request.requestId}`,
            JSON.stringify({
              status: 500,
              body: "Internal server error",
            })
          );
        }
      };

      const stream = new ReadableStream({
        start: async (controller) => {
          try {
            await server.connect(transport);
            controller.close();
          } catch (error) {
            console.error("Error in SSE connection:", error);
            controller.error(error);
          }
        },
        cancel: () => {
          messageChannel.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } else if (url.pathname === "/api/message") {
      const sessionId = url.searchParams.get("sessionId");
      if (!sessionId) {
        return new Response("No sessionId provided", { status: 400 });
      }

      const requestId = crypto.randomUUID();
      const body = await req.text();

      const serializedRequest: SerializedRequest = {
        requestId,
        url: req.url,
        method: req.method,
        body,
        headers: req.headers,
      };

      // Publish the message to the session's channel
      const messageChannel = new BroadcastChannel(`requests:${sessionId}`);
      messageChannel.postMessage(serializedRequest);

      // Wait for response
      const response = await kv.blpop(
        `responses:${sessionId}:${requestId}`,
        10
      );
      messageChannel.close();

      if (!response) {
        return new Response("Request timed out", { status: 408 });
      }

      const { status, body: responseBody } = JSON.parse(response[1]);
      return new Response(responseBody, { status });
    }

    return new Response("Not found", { status: 404 });
  };
}
