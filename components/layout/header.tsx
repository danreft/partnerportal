"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { Layout, Menu, Drawer, Button, message, Divider, Avatar, Space } from "antd"
import { BarChartOutlined, TeamOutlined, UserOutlined, CopyOutlined, LogoutOutlined } from "@ant-design/icons"
import { useState } from "react"

export function Header() {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    message.success(`${label} copied to clipboard!`)
  }

  const selectedKey = pathname === "/referrals" ? "referrals" : "dashboard"

  return (
    <Layout.Header style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: 0, minWidth: 320 }}>
      <div className="mx-auto flex h-16 items-center justify-between px-6" style={{ minWidth: 320 }}>
        <div className="flex items-center gap-6 min-w-0" style={{ flex: 1 }}>
          <Link href="/" className="flex items-center gap-2 min-w-max">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border-2 border-[#4a9d6f] p-1">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Kv0q55cARkvzD4tpBpzdOKq8ulAcue.png"
                alt="BoaSafra Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-semibold text-[#2d5f4a]">Referral Partner Portal</span>
          </Link>
          <div className="min-w-max">
            <Menu
              mode="horizontal"
              selectedKeys={[selectedKey]}
              style={{ background: "#fff", border: "none", fontWeight: 500, fontSize: 16, minWidth: 220 }}
              items={[
                {
                  key: "dashboard",
                  label: (
                    <Link href="/" className="flex items-center gap-2">
                      <BarChartOutlined /> Dashboard
                    </Link>
                  ),
                },
                {
                  key: "referrals",
                  label: (
                    <Link href="/referrals" className="flex items-center gap-2">
                      <TeamOutlined /> Referrals
                    </Link>
                  ),
                },
              ]}
            />
          </div>
        </div>

        <Button type="text" onClick={() => setDrawerOpen(true)}>
          <Space size={8}>
            <Avatar size={32} style={{ backgroundColor: "#4a9d6f" }} icon={<UserOutlined />} />
            <span className="font-medium text-gray-700">John Smith</span>
          </Space>
        </Button>

        <Drawer
          title="User Profile"
          placement="right"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
          width={400}
        >
          <div className="flex h-full min-h-full flex-col">
            <div className="space-y-6">
              {/* User Info Section */}
              <div className="flex items-center gap-3">
                <Avatar size={64} style={{ backgroundColor: "#4a9d6f" }} icon={<UserOutlined />} />
                <div>
                  <div className="text-lg font-semibold text-gray-900">John Smith</div>
                  <div className="text-sm text-gray-500">john.smith@example.com</div>
                </div>
              </div>

              <Divider />

              {/* Referral Partner Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Referral Information</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">Your URL</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 text-sm text-gray-700 truncate bg-gray-50 px-3 py-2 rounded">
                        https://soiltest.com/ref/johnsmith
                      </div>
                      <Button
                        size="small"
                        type="default"
                        icon={<CopyOutlined />}
                        onClick={() => copyToClipboard("https://soiltest.com/ref/johnsmith", "URL")}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">Your Code</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 text-sm font-mono text-gray-700 bg-gray-50 px-3 py-2 rounded">
                        JSMITH2024
                      </div>
                      <Button size="small" type="default" icon={<CopyOutlined />} onClick={() => copyToClipboard("JSMITH2024", "Code")}>Copy</Button>
                    </div>
                  </div>
                </div>
              </div>

              <Divider />

              {/* Settings Menu */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Settings</h3>
                <div className="space-y-2">
                  <Button type="default" block style={{ textAlign: "left" }}>
                    Change Password
                  </Button>
                  <Button type="default" block style={{ textAlign: "left" }}>
                    Email Preferences
                  </Button>
                  <Button type="default" block style={{ textAlign: "left" }}>
                    Notification Settings
                  </Button>
                  <Button type="default" block style={{ textAlign: "left" }}>
                    Check for Updates
                  </Button>
                </div>
              </div>
            </div>

            {/* Bottom area with Logout */}
            <div className="mt-auto pt-4">
              <Divider />
              <Button type="primary" danger block size="large" icon={<LogoutOutlined />}>
                Logout
              </Button>
            </div>
          </div>
        </Drawer>
      </div>
    </Layout.Header>
  )
}
