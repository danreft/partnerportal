import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AntdRegistry } from "@ant-design/nextjs-registry"
import { ConfigProvider } from "antd"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Referral Partner Portal",
  description: "Manage your referral leads and track progress",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#4a9d6f",
                borderRadius: 6,
              },
            }}
          >
            <Suspense fallback={null}>{children}</Suspense>
          </ConfigProvider>
        </AntdRegistry>
        <Analytics />
      </body>
    </html>
  )
}
