"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button, Avatar, Tag } from "antd"
import { UserOutlined, TeamOutlined } from "@ant-design/icons"
import { useUser } from "@/components/user-context"
import { MOCK_USERS, type AppUser } from "@/lib/mock-users"

const partners = MOCK_USERS.filter((u) => u.role === "partner")
const managers = MOCK_USERS.filter((u) => u.role === "manager")

function UserCard({ user, onSelect }: { user: AppUser; onSelect: (u: AppUser) => void }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        width: 220,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <Avatar
        size={64}
        style={{ backgroundColor: user.avatarColor, fontSize: 22, fontWeight: 600 }}
      >
        {user.initials}
      </Avatar>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontWeight: 600, fontSize: 16, color: "#111827" }}>{user.name}</div>
        <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{user.email}</div>
      </div>
      <Tag
        icon={user.role === "manager" ? <TeamOutlined /> : <UserOutlined />}
        color={user.role === "manager" ? "blue" : "green"}
        style={{ marginTop: 2 }}
      >
        {user.title}
      </Tag>
      <Button
        type="primary"
        block
        style={{ marginTop: 4 }}
        onClick={() => onSelect(user)}
      >
        Sign in
      </Button>
    </div>
  )
}

export default function LoginPage() {
  const { setUser } = useUser()
  const router = useRouter()

  const handleSelect = (user: AppUser) => {
    setUser(user)
    router.push(user.role === "manager" ? "/manager" : "/")
  }

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
        <p style={{ color: "#6b7280", fontSize: 15, margin: 0 }}>Choose an account to continue</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 40, alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af", marginBottom: 16, textAlign: "center" }}>
            Referral Partners
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
            {partners.map((u) => (
              <UserCard key={u.id} user={u} onSelect={handleSelect} />
            ))}
          </div>
        </div>

        <div style={{ width: "100%", height: 1, background: "#e5e7eb" }} />

        <div>
          <div style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af", marginBottom: 16, textAlign: "center" }}>
            Management
          </div>
          <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
            {managers.map((u) => (
              <UserCard key={u.id} user={u} onSelect={handleSelect} />
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 56 }}>
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
