import type React from "react"
import "./globals.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Onchain Mantle MPC",
  description:
    "Connect this mpc server to discuss your DeFi strategies with real-time data from Mantle's leading protocols",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center p-8">{children}</body>
    </html>
  )
}

