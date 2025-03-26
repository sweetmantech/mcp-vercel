import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-8">
      <div className="max-w-6xl w-full mx-auto relative">
        {/* Decorative elements */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>

        <div className="text-center mb-16 relative">
          <div className="inline-flex items-center gap-2 mb-4 glass px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-300">
              Live on Mantle Network
            </span>
          </div>

          <h1 className="text-7xl font-bold mb-6 tracking-tight">
            Onchain{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              MANTLE
            </span>{" "}
            MCP SERVER
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
            Connect this mcp server to cursor, claude, t3chat or your preferred
            ai workspace to discuss your DeFi strategies with real-time data
            from Mantle's leading protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="glass rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
            <h2 className="text-2xl font-semibold mb-8 relative">
              Supported Protocols
            </h2>
            <div className="space-y-6 relative">
              <div className="gradient-border">
                <a
                  href="https://defillama.com/protocol/treehouse-protocol"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="protocol-card block p-6 rounded-2xl group relative overflow-hidden"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-emerald-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M4 20h16M4 20v-4m0 4l5-5m-5 5v-4m0 4l5-5M4 12V8m0 4l5-5m-5 5V8m0 4l5-5m11 13v-4m0 4l-5-5m5 5v-4m0 4l-5-5m5-3V8m0 4l-5-5m5 5V8m0 4l-5-5M8 20h8"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                        Treehouse Protocol
                      </h3>
                      <p className="text-gray-400 mt-1">
                        Leading lending protocol on Mantle
                      </p>
                    </div>
                  </div>
                </a>
              </div>

              <div className="gradient-border">
                <a
                  href="https://defillama.com/protocol/merchant-moe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="protocol-card block p-6 rounded-2xl group relative overflow-hidden"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-purple-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                        Merchant Moe
                      </h3>
                      <p className="text-gray-400 mt-1">
                        Innovative DEX on Mantle
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-[#2A2A2A] backdrop-blur-sm">
            <h2 className="text-2xl font-semibold mb-6">Live Data Features</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 bg-[#252525] p-6 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Real-time Token Prices</h3>
                  <p className="text-sm text-gray-400">
                    Live price updates from Mantle Network
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-[#252525] p-6 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Protocol Statistics</h3>
                  <p className="text-sm text-gray-400">
                    Comprehensive TVL and protocol metrics
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-[#252525] p-6 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Stablecoin Analytics</h3>
                  <p className="text-sm text-gray-400">
                    Deep insights into stablecoin metrics
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800/20 to-gray-900/20"></div>
          <div className="flex items-center justify-between mb-6 relative">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]"></div>
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
              <div className="w-3 h-3 rounded-full bg-[#28C840]"></div>
            </div>
            <div className="text-sm text-gray-500 font-mono">
              mcp-config.json
            </div>
          </div>
          <pre className="text-sm bg-[#0A0A0A] rounded-2xl p-6 overflow-x-auto font-mono relative">
            <code className="text-gray-300">{`{
  "mcpServers": {
    "onchain-context": {
      "type": "remote",
      "url": "https://onchain-beryl.vercel.app/sse",
      "supportsStreaming": true
    }
  }
}`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
