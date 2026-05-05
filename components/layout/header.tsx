"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import { Layout, Menu, Drawer, Button, message, Divider, Avatar, Space, Segmented } from "antd"
import { BarChartOutlined, TeamOutlined, ClockCircleOutlined, UserOutlined, CopyOutlined, LogoutOutlined, AppstoreOutlined } from "@ant-design/icons"
import { useState } from "react"
import { useUser, type ViewMode } from "@/components/user-context"

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, setUser, viewMode, setViewMode } = useUser()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    message.success(`${label} copied to clipboard!`)
  }

  const handleLogout = () => {
    setDrawerOpen(false)
    setUser(null)
    router.push("/login")
  }

  const isManager = user?.role === "manager"

  const selectedKey = isManager
    ? pathname === "/manager/referrals" ? "referrals" : pathname === "/activity" ? "activity" : pathname.startsWith("/resources") ? "resources" : "dashboard"
    : pathname.startsWith("/referrals") ? "referrals" : pathname === "/activity" ? "activity" : pathname.startsWith("/resources") ? "resources" : "dashboard"

  const menuItems = isManager
    ? [
        {
          key: "dashboard",
          label: <Link href="/manager" className="flex items-center gap-2"><BarChartOutlined /> Dashboard</Link>,
        },
        {
          key: "activity",
          label: <Link href="/activity" className="flex items-center gap-2"><ClockCircleOutlined /> Activity</Link>,
        },
        {
          key: "referrals",
          label: <Link href="/manager/referrals" className="flex items-center gap-2"><TeamOutlined /> Referrals</Link>,
        },
        {
          key: "resources",
          label: <Link href="/resources" className="flex items-center gap-2"><AppstoreOutlined /> Resources</Link>,
        },
      ]
    : [
        {
          key: "dashboard",
          label: <Link href="/" className="flex items-center gap-2"><BarChartOutlined /> Dashboard</Link>,
        },
        {
          key: "activity",
          label: <Link href="/activity" className="flex items-center gap-2"><ClockCircleOutlined /> Activity</Link>,
        },
        {
          key: "referrals",
          label: <Link href="/referrals" className="flex items-center gap-2"><TeamOutlined /> Referrals</Link>,
        },
        {
          key: "resources",
          label: <Link href="/resources" className="flex items-center gap-2"><AppstoreOutlined /> Resources</Link>,
        },
      ]

  return (
    <Layout.Header style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: 0, minWidth: 320 }}>
      <div className="mx-auto flex h-16 items-center justify-between px-6" style={{ minWidth: 320 }}>
        <div className="flex items-center gap-6 min-w-0" style={{ flex: 1 }}>
          <Link href={isManager ? "/manager" : "/"} className="flex items-center gap-2 min-w-max">
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
              disabledOverflow
              style={{ background: "#fff", border: "none", fontWeight: 500, fontSize: 16, minWidth: 320 }}
              items={menuItems}
            />
          </div>
        </div>

        {isManager && (
          <Segmented
            value={viewMode}
            onChange={(v) => setViewMode(v as ViewMode)}
            options={[
              { label: "Team", value: "team" },
              { label: "Only Me", value: "self" },
            ]}
            style={{ marginRight: 12 }}
          />
        )}
        <Button type="text" onClick={() => setDrawerOpen(true)}>
          <Space size={8}>
            <Avatar
              size={32}
              style={{ backgroundColor: user?.avatarColor ?? "#4a9d6f", fontSize: 13, fontWeight: 600 }}
            >
              {user?.initials ?? <UserOutlined />}
            </Avatar>
            <span className="font-medium text-gray-700">{user?.name ?? "Guest"}</span>
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
              <div className="flex items-center gap-3">
                <Avatar size={64} style={{ backgroundColor: user?.avatarColor ?? "#4a9d6f", fontSize: 22, fontWeight: 600 }}>
                  {user?.initials ?? <UserOutlined />}
                </Avatar>
                <div>
                  <div className="text-lg font-semibold text-gray-900">{user?.name ?? "Guest"}</div>
                  <div className="text-sm text-gray-500">{user?.email}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{user?.title}</div>
                </div>
              </div>

              <Divider />

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Referral Information</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">Your URL</div>
                    {user?.referralCode ? (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 text-sm text-gray-700 truncate bg-gray-50 px-3 py-2 rounded">
                          https://soiltest.com/ref/{user.referralCode.toLowerCase()}
                        </div>
                        <Button
                          size="small"
                          type="default"
                          icon={<CopyOutlined />}
                          onClick={() => copyToClipboard(`https://soiltest.com/ref/${user.referralCode!.toLowerCase()}`, "URL")}
                        >
                          Copy
                        </Button>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded">N/A</div>
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">Your Code</div>
                    {user?.referralCode ? (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 text-sm font-mono text-gray-700 bg-gray-50 px-3 py-2 rounded">
                          {user.referralCode}
                        </div>
                        <Button size="small" type="default" icon={<CopyOutlined />} onClick={() => copyToClipboard(user!.referralCode ?? "", "Code")}>Copy</Button>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded">N/A</div>
                    )}
                  </div>
                </div>
              </div>

              <Divider />

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Partner Storefront</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs font-medium text-gray-500 mb-1">Storefront URL</div>
                    <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded">Coming soon!</div>
                  </div>
                </div>
              </div>

              <Divider />

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Settings</h3>
                <div className="space-y-2">
                  <Button type="default" block style={{ textAlign: "left" }}>Change Password</Button>
                  <Button type="default" block style={{ textAlign: "left" }}>Email Preferences</Button>
                  <Button type="default" block style={{ textAlign: "left" }}>Notification Settings</Button>
                  <Button type="default" block style={{ textAlign: "left" }}>Check for Updates</Button>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-4">
              <Divider />
              <Button type="primary" danger block size="large" icon={<LogoutOutlined />} onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </Drawer>
      </div>
    </Layout.Header>
  )
}
