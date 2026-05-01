"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AuthGuard } from "@/components/auth-guard"
import { StalledEmailTemplateContent } from "@/components/stalled-email-template-content"
import { Typography, Breadcrumb } from "antd"
import Link from "next/link"

const { Title } = Typography

export default function StalledEmailTemplatePage() {
  return (
    <AuthGuard>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f9fafb" }}>
        <Header />
        <main style={{ width: "100%", maxWidth: 1200, margin: "0 auto", flex: 1, padding: 32 }}>
          <Breadcrumb
            style={{ marginBottom: 16 }}
            items={[
              { title: <Link href="/referrals">Referrals</Link> },
              { title: <Link href="/referrals?tab=stalled">Stalled</Link> },
              { title: "Stalled Deal Email Template" },
            ]}
          />
          <Title level={3} style={{ marginBottom: 20, fontWeight: 600, color: "#111" }}>
            Stalled Deal Email Template
          </Title>
          <StalledEmailTemplateContent />
        </main>
        <Footer />
      </div>
    </AuthGuard>
  )
}
