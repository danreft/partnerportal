"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AuthGuard } from "@/components/auth-guard"
import { StalledEmailTemplateContent } from "@/components/stalled-email-template-content"
import { ConciergeInvoiceGenerator } from "@/components/concierge-invoice-generator"
import { CollateralRequestForm } from "@/components/collateral-request-form"
import { Typography, Tabs, Card } from "antd"
import { useSearchParams } from "next/navigation"
import { useState } from "react"

const { Title, Text } = Typography

function ComingSoonTab({ label }: { label: string }) {
  return (
    <Card variant="bordered">
      <div style={{ padding: "48px 0", textAlign: "center" }}>
        <Text type="secondary" style={{ fontSize: 16 }}>{label} — coming soon.</Text>
      </div>
    </Card>
  )
}

const tabItems = [
  {
    key: "concierge-invoice",
    label: "Concierge Invoice Generator",
    children: <ConciergeInvoiceGenerator />,
  },
  {
    key: "collateral-request",
    label: "Collateral Request",
    children: <CollateralRequestForm />,
  },
  {
    key: "stalled-email",
    label: "Stalled Deal Email Template",
    children: <StalledEmailTemplateContent />,
  },
  {
    key: "meeting-request",
    label: "Meeting Request",
    children: (
      <iframe
        src="https://docs.google.com/forms/d/1TaBzuTaaRqDsTbCYaubnwL9f45g6xDZKecbUDgyxxy0/viewform?embedded=true"
        style={{ width: "100%", height: 900, border: "none", borderRadius: 8 }}
        title="Meeting Request"
      />
    ),
  },
]

export default function ResourcesPage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") ?? "concierge-invoice")

  return (
    <AuthGuard>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f9fafb" }}>
        <Header />
        <main style={{ width: "100%", maxWidth: 1200, margin: "0 auto", flex: 1, padding: 32 }}>
          <Title level={3} style={{ marginBottom: 24, fontWeight: 600, color: "#111" }}>
            Resources
          </Title>
          <Tabs items={tabItems} activeKey={activeTab} onChange={setActiveTab} />
        </main>
        <Footer />
      </div>
    </AuthGuard>
  )
}
