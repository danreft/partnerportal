"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { leadsData, isLeadStalled } from "@/lib/mock-data"
import { AuthGuard } from "@/components/auth-guard"
import { Card, Typography } from "antd"
import { CheckCircleFilled, ClockCircleFilled, StopOutlined } from "@ant-design/icons"
import { Row, Col, Space } from "antd"
import { StageTable } from "@/components/stage-table"
import { AnnouncementsCard } from "@/components/announcements-card"



function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <Space direction="vertical" size={2} style={{ width: "100%" }}>
      <Typography.Title level={2} style={{ margin: 0, fontWeight: 600, fontSize: 36, lineHeight: 1 }}>{value}</Typography.Title>
      <Typography.Text type="secondary" style={{ fontSize: 14 }}>{label}</Typography.Text>
    </Space>
  )
}

export default function DashboardPage() {
  // Helpers
  const parseAcres = (acres: string) => {
    const digits = acres.replace(/[^0-9]/g, "")
    return digits ? parseInt(digits, 10) : 0
  }
  const fmt = (n: number) => n.toLocaleString()

  // Basic buckets
  const referrals = leadsData.length
  const wonLeads = leadsData.filter((l) => l.stage === "Won")
  const lostLeads = leadsData.filter((l) => l.stage === "Lost")
  const activeLeads = leadsData.filter((l) => l.stage !== "Won" && l.stage !== "Lost")

  // New bucket: Active Leads (not yet in Active Deals stages)
  const activeLeadStages = [
    "Contact Form Submitted",
    "Request for Services Submitted",
    "Invitation Sent",
    "Inbound Calls",
    "Inbound Contact Forms"
  ]
  const activeLeadsOnly = activeLeads.filter(l => activeLeadStages.includes(l.stage))
  const ACTIVE_LEADS = {
    deals: activeLeadsOnly.length,
    acres: fmt(activeLeadsOnly.reduce((sum, l) => sum + parseAcres(l.acres), 0)),
  }

  // Existing bucket: Active Deals (all other active stages)
  const activeDealsOnly = activeLeads.filter(l => !activeLeadStages.includes(l.stage))
  const ACTIVE_DEALS = {
    deals: activeDealsOnly.length,
    acres: fmt(activeDealsOnly.reduce((sum, l) => sum + parseAcres(l.acres), 0)),
  }

  const stalledLeads = leadsData.filter(isLeadStalled)
  const STALLED = {
    deals: stalledLeads.length,
    acres: fmt(stalledLeads.reduce((sum, l) => sum + parseAcres(l.acres), 0)),
  }

  const REFERRALS = referrals
  const WON = {
    deals: wonLeads.length,
    acres: wonLeads.reduce((sum, l) => sum + parseAcres(l.acres), 0),
  }
  const LOST = {
    deals: lostLeads.length,
    acres: lostLeads.reduce((sum, l) => sum + parseAcres(l.acres), 0),
  }


  return (
    <AuthGuard role="partner">
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f9fafb" }}>
      <Header />
      <main style={{ width: "100%", maxWidth: 1200, margin: "0 auto", flex: 1, padding: 32 }}>
        <Typography.Title level={3} style={{ marginBottom: 24, fontWeight: 600, color: "#111" }}>Dashboard</Typography.Title>
        {/* Row 1: Referrals, Active Leads, Active Deals */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            <Card title={<Typography.Text strong>Referrals</Typography.Text>} variant="bordered">
              <Stat label="Received" value={REFERRALS} />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title={<Typography.Text strong>Active Leads</Typography.Text>} variant="bordered">
              <Row gutter={0} align="middle">
                <Col span={12}>
                  <Stat label="Leads" value={ACTIVE_LEADS.deals} />
                </Col>
                <Col span={12}>
                  <Stat label="Acres" value={ACTIVE_LEADS.acres} />
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title={<Typography.Text strong>Active Deals</Typography.Text>} variant="bordered">
              <Row gutter={0} align="middle">
                <Col span={12}>
                  <Stat label="Deals" value={ACTIVE_DEALS.deals} />
                </Col>
                <Col span={12}>
                  <Stat label="Acres" value={ACTIVE_DEALS.acres} />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        {/* Row 2: Stalled, Won Deals, Lost Deals */}
        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col xs={24} lg={8}>
            <Card
              title={<Space align="center"><ClockCircleFilled style={{ color: "#d97706" }} /><Typography.Text strong style={{ color: "#92400e" }}>Stalled</Typography.Text></Space>}
              variant="bordered"
            >
              <Row gutter={0} align="middle">
                <Col span={12}><Stat label="Deals" value={STALLED.deals} /></Col>
                <Col span={12}><Stat label="Acres" value={STALLED.acres} /></Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card
              title={<Space align="center"><CheckCircleFilled style={{ color: "#52c41a" }} /><Typography.Text strong style={{ color: "#237804" }}>Won Deals</Typography.Text></Space>}
              variant="bordered"
            >
              <Row gutter={0} align="middle">
                <Col span={12}><Stat label="Deals" value={WON.deals} /></Col>
                <Col span={12}><Stat label="Acres" value={fmt(WON.acres)} /></Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card
              title={<Space align="center"><StopOutlined style={{ color: "#ff4d4f" }} /><Typography.Text strong style={{ color: "#a8071a" }}>Lost Deals</Typography.Text></Space>}
              variant="bordered"
            >
              <Row gutter={0} align="middle">
                <Col span={12}><Stat label="Deals" value={LOST.deals} /></Col>
                <Col span={12}><Stat label="Acres" value={fmt(LOST.acres)} /></Col>
              </Row>
            </Card>
          </Col>
        </Row>
        {/* Row 3: Stage Table + Announcements */}
        <Row gutter={[24, 24]} style={{ marginTop: 24 }} align="stretch">
          <Col xs={24} lg={16} style={{ display: "flex", flexDirection: "column" }}>
            <StageTable />
          </Col>
          <Col xs={24} lg={8} style={{ display: "flex", flexDirection: "column" }}>
            <AnnouncementsCard />
          </Col>
        </Row>
      </main>
      <Footer />
    </div>
    </AuthGuard>
  )
}
