import getRawBody from "raw-body";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { IncomingHttpHeaders, IncomingMessage, ServerResponse } from "http";
import { Socket } from "net";
import { Readable } from "stream";
import { ServerOptions } from "@modelcontextprotocol/sdk/server/index.js";
import { kv } from "@vercel/kv";

interface SerializedRequest {
  requestId: string;
  url: string;
  method: string;
  body: string;
  headers: IncomingHttpHeaders;
}

interface MessageSubscriber {
  callback: (message: string) => void;
}

const subscribers = new Map<string, Set<MessageSubscriber>>();

export function initializeMcpApiHandler(
  initializeServer: (server: McpServer) => void,
  serverOptions: ServerOptions = {}
) {
  const maxDuration = 800; // Default max duration in seconds
  let servers: McpServer[] = [];

  // Helper function to manage subscribers
  const subscribeToChannel = (
    channel: string,
    callback: (message: string) => void
  ) => {
    if (!subscribers.has(channel)) {
      subscribers.set(channel, new Set());
    }
    const subscriber = { callback };
    subscribers.get(channel)?.add(subscriber);
    return () => {
      subscribers.get(channel)?.delete(subscriber);
      if (subscribers.get(channel)?.size === 0) {
        subscribers.delete(channel);
      }
    };
  };

  // Helper function to publish messages
  const publishMessage = async (channel: string, message: string) => {
    // Store message in KV
    await kv.set(`message:${channel}:${Date.now()}`, message, { ex: 3600 }); // Expire after 1 hour

    // Notify subscribers
    subscribers.get(channel)?.forEach((subscriber) => {
      subscriber.callback(message);
    });
  };

  return async function mcpApiHandler(
    req: IncomingMessage,
    res: ServerResponse
  ) {
    const url = new URL(
      req.url || "",
      `https://${req.headers.host || "localhost"}`
    );

    if (url.pathname === "/sse") {
      console.log("Got new SSE connection");

      const transport = new SSEServerTransport("/message", res);
      const sessionId = transport.sessionId;
      const server = new McpServer(
        {
          name: "mcp-nextjs-server",
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

      let logs: {
        type: "log" | "error";
        messages: string[];
      }[] = [];

      function logInContext(severity: "log" | "error", ...messages: string[]) {
        logs.push({
          type: severity,
          messages,
        });
      }

      // Handle messages
      const handleMessage = async (message: string) => {
        console.log("Received message", message);
        logInContext("log", "Received message", message);
        const request = JSON.parse(message) as SerializedRequest;

        const req = createFakeIncomingMessage({
          method: request.method,
          url: request.url,
          headers: request.headers,
          body: request.body,
        });

        const syntheticRes = new ServerResponse(req);
        let status = 100;
        let body = "";

        syntheticRes.writeHead = (statusCode: number) => {
          status = statusCode;
          return syntheticRes;
        };

        syntheticRes.end = (b: unknown) => {
          body = b as string;
          return syntheticRes;
        };

        await transport.handlePostMessage(req, syntheticRes);

        await publishMessage(
          `responses:${sessionId}:${request.requestId}`,
          JSON.stringify({
            status,
            body,
          })
        );

        if (status >= 200 && status < 300) {
          logInContext(
            "log",
            `Request ${sessionId}:${request.requestId} succeeded: ${body}`
          );
        } else {
          logInContext(
            "error",
            `Message for ${sessionId}:${request.requestId} failed with status ${status}: ${body}`
          );
        }
      };

      const interval = setInterval(() => {
        for (const log of logs) {
          console[log.type].call(console, ...log.messages);
        }
        logs = [];
      }, 100);

      const unsubscribe = subscribeToChannel(
        `requests:${sessionId}`,
        handleMessage
      );
      console.log(`Subscribed to requests:${sessionId}`);

      let timeout: NodeJS.Timeout;
      let resolveTimeout: (value: unknown) => void;
      const waitPromise = new Promise((resolve) => {
        resolveTimeout = resolve;
        timeout = setTimeout(() => {
          resolve("max duration reached");
        }, (maxDuration - 5) * 1000);
      });

      async function cleanup() {
        clearTimeout(timeout);
        clearInterval(interval);
        unsubscribe();
        console.log("Done");
        res.statusCode = 200;
        res.end();
      }

      req.on("close", () => resolveTimeout("client hang up"));

      await server.connect(transport);
      const closeReason = await waitPromise;
      console.log(closeReason);
      await cleanup();
    } else if (url.pathname === "/message") {
      console.log("Received message");

      const body = await getRawBody(req, {
        length: req.headers["content-length"],
        encoding: "utf-8",
      });

      const sessionId = url.searchParams.get("sessionId") || "";
      if (!sessionId) {
        res.statusCode = 400;
        res.end("No sessionId provided");
        return;
      }

      const requestId = crypto.randomUUID();
      const serializedRequest: SerializedRequest = {
        requestId,
        url: req.url || "",
        method: req.method || "",
        body: body,
        headers: req.headers,
      };

      let responseReceived = false;
      const responsePromise = new Promise<void>((resolve) => {
        const timeout = setTimeout(() => {
          if (!responseReceived) {
            res.statusCode = 408;
            res.end("Request timed out");
            resolve();
          }
        }, 10000);

        const unsubscribe = subscribeToChannel(
          `responses:${sessionId}:${requestId}`,
          (message: string) => {
            clearTimeout(timeout);
            if (!responseReceived) {
              responseReceived = true;
              const response = JSON.parse(message) as {
                status: number;
                body: string;
              };
              res.statusCode = response.status;
              res.end(response.body);
              unsubscribe();
              resolve();
            }
          }
        );
      });

      // Publish the request
      await publishMessage(
        `requests:${sessionId}`,
        JSON.stringify(serializedRequest)
      );
      console.log(`Published request:${sessionId}`, serializedRequest);

      // Wait for response or timeout
      await responsePromise;
    } else {
      res.statusCode = 404;
      res.end("Not found");
    }
  };
}

interface FakeIncomingMessageOptions {
  method?: string;
  url?: string;
  headers?: IncomingHttpHeaders;
  body?: string | Buffer | Record<string, unknown>;
  socket?: Socket;
}

function createFakeIncomingMessage(
  options: FakeIncomingMessageOptions = {}
): IncomingMessage {
  const {
    method = "GET",
    url = "/",
    headers = {},
    body = null,
    socket = new Socket(),
  } = options;

  const readable = new Readable();
  readable._read = (): void => {};

  if (body) {
    if (typeof body === "string") {
      readable.push(body);
    } else if (Buffer.isBuffer(body)) {
      readable.push(body);
    } else {
      readable.push(JSON.stringify(body));
    }
    readable.push(null);
  }

  const req = new IncomingMessage(socket);

  req.method = method;
  req.url = url;
  req.headers = headers;

  req.push = readable.push.bind(readable);
  req.read = readable.read.bind(readable);

  // Type assertion to handle the event binding
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req as any).on = readable.on.bind(readable);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req as any).pipe = readable.pipe.bind(readable);

  return req;
}
