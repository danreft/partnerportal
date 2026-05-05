"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button, Select, Tag } from "antd"
import { UserOutlined, TeamOutlined } from "@ant-design/icons"
import { useUser } from "@/components/user-context"
import { MOCK_USERS, type AppUser } from "@/lib/mock-users"

const roleLabel: Record<string, string> = {
  partner: "Referral Partner",
  manager: "Referral Team Manager",
}

const roleColor: Record<string, string> = {
  partner: "green",
  manager: "blue",
}

export default function LoginPage() {
  const { setUser } = useUser()
  const router = useRouter()
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)

  const handleSignIn = () => {
    const user = MOCK_USERS.find((u) => u.id === selectedId)
    if (!user) return
    setUser(user)
    router.push(user.role === "manager" ? "/manager" : "/")
  }

  const options = MOCK_USERS.map((u) => ({
    value: u.id,
    label: (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "2px 0" }}>
        <span style={{ fontWeight: 500, color: "#111827" }}>{u.name}</span>
        <Tag
          icon={u.role === "manager" ? <TeamOutlined /> : <UserOutlined />}
          color={roleColor[u.role]}
          style={{ margin: 0, flexShrink: 0 }}
        >
          {roleLabel[u.role]}
        </Tag>
      </div>
    ),
  }))

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f9fafb",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
      }}
    >
      <div style={{ marginBottom: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", height: 52, width: 52, alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "#fff", border: "2px solid #4a9d6f", padding: 4 }}>
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Kv0q55cARkvzD4tpBpzdOKq8ulAcue.png"
              alt="BoaSafra Logo"
              width={36}
              height={36}
              style={{ objectFit: "contain" }}
            />
          </div>
          <span style={{ fontSize: 22, fontWeight: 700, color: "#2d5f4a" }}>Referral Partner Portal</span>
        </div>
        <p style={{ color: "#6b7280", fontSize: 15, margin: 0 }}>Select an account to continue</p>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 16,
          padding: "36px 32px",
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>Sign in as</div>
        <Select
          placeholder="Select a user..."
          options={options}
          value={selectedId}
          onChange={setSelectedId}
          size="large"
          style={{ width: "100%" }}
          optionLabelProp="label"
          popupMatchSelectWidth
        />
        <Button
          type="primary"
          size="large"
          block
          disabled={!selectedId}
          onClick={handleSignIn}
          style={{ marginTop: 4 }}
        >
          Sign In
        </Button>
      </div>

      <div style={{ marginTop: 48 }}>
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-U20NNFuXIuRgVFL8KZ8DxdJ3sExZBr.png"
          alt="BoaSafra AG"
          width={160}
          height={40}
          style={{ objectFit: "contain", opacity: 0.6 }}
        />
      </div>
    </div>
  )
}
