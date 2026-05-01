"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AuthGuard } from "@/components/auth-guard"
import { leadsData, isLeadStalled } from "@/lib/mock-data"
import { MOCK_USERS } from "@/lib/mock-users"
import { Card, Table, Typography, Avatar } from "antd"
import { CheckCircleFilled, ClockCircleFilled, StopOutlined } from "@ant-design/icons"
import { Row, Col, Space } from "antd"
import type { ColumnsType } from "antd/es/table"
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

const parseAcres = (acres: string) => {
  const digits = acres.replace(/[^0-9]/g, "")
  return digits ? parseInt(digits, 10) : 0
}
const fmt = (n: number) => n.toLocaleString()

const partners = MOCK_USERS.filter((u) => u.role === "partner")

interface PartnerRow {
  key: string
  name: string
  initials: string
  avatarColor: string
  referralCode: string
  referrals: number
  activeLeads: number
  activeDealsCount: number
  stalled: number
  won: number
  lost: number
  totalAcres: number
}

const activeLeadStages = [
  "Contact Form Submitted",
  "Request for Services Submitted",
  "Invitation Sent",
  "Inbound Calls",
  "Inbound Contact Forms",
]

function buildPartnerRows(): PartnerRow[] {
  return partners.map((partner) => {
    const leads = leadsData.filter((l) => l.referralCode === partner.referralCode)
    const active = leads.filter((l) => l.stage !== "Won" && l.stage !== "Lost")
    return {
      key: partner.id,
      name: partner.name,
      initials: partner.initials,
      avatarColor: partner.avatarColor,
      referralCode: partner.referralCode ?? "",
      referrals: leads.length,
      activeLeads: active.filter((l) => activeLeadStages.includes(l.stage)).length,
      activeDealsCount: active.filter((l) => !activeLeadStages.includes(l.stage)).length,
      stalled: leads.filter(isLeadStalled).length,
      won: leads.filter((l) => l.stage === "Won").length,
      lost: leads.filter((l) => l.stage === "Lost").length,
      totalAcres: leads.reduce((s, l) => s + parseAcres(l.acres), 0),
    }
  })
}

const partnerRows = buildPartnerRows()

const columns: ColumnsType<PartnerRow> = [
  {
    title: "Partner",
    key: "name",
    render: (_, r) => (
      <Space>
        <Avatar style={{ backgroundColor: r.avatarColor, fontWeight: 600 }}>{r.initials}</Avatar>
        <div>
          <div style={{ fontWeight: 500 }}>{r.name}</div>
          <div style={{ fontSize: 12, color: "#9ca3af" }}>{r.referralCode}</div>
        </div>
      </Space>
    ),
    sorter: (a, b) => a.name.localeCompare(b.name),
  },
  {
    title: "Referrals",
    dataIndex: "referrals",
    key: "referrals",
    sorter: (a, b) => a.referrals - b.referrals,
  },
  {
    title: "Active Leads",
    dataIndex: "activeLeads",
    key: "activeLeads",
    sorter: (a, b) => a.activeLeads - b.activeLeads,
  },
  {
    title: "Active Deals",
    dataIndex: "activeDealsCount",
    key: "activeDealsCount",
    sorter: (a, b) => a.activeDealsCount - b.activeDealsCount,
  },
  {
    title: "Stalled",
    dataIndex: "stalled",
    key: "stalled",
    sorter: (a, b) => a.stalled - b.stalled,
    render: (v: number) => (
      <span style={{ color: v > 0 ? "#d97706" : undefined, fontWeight: v > 0 ? 500 : undefined }}>{v}</span>
    ),
  },
  {
    title: "Won",
    dataIndex: "won",
    key: "won",
    sorter: (a, b) => a.won - b.won,
    render: (v: number) => <span style={{ color: v > 0 ? "#16a34a" : undefined }}>{v}</span>,
  },
  {
    title: "Lost",
    dataIndex: "lost",
    key: "lost",
    sorter: (a, b) => a.lost - b.lost,
    render: (v: number) => <span style={{ color: v > 0 ? "#dc2626" : undefined }}>{v}</span>,
  },
  {
    title: "Total Acres",
    dataIndex: "totalAcres",
    key: "totalAcres",
    sorter: (a, b) => a.totalAcres - b.totalAcres,
    render: (v: number) => fmt(v),
  },
]

// Team-wide totals
const allLeads = leadsData
const wonAll = allLeads.filter((l) => l.stage === "Won")
const lostAll = allLeads.filter((l) => l.stage === "Lost")
const activeAll = allLeads.filter((l) => l.stage !== "Won" && l.stage !== "Lost")
const stalledAll = allLeads.filter(isLeadStalled)

const TOTALS = {
  referrals: allLeads.length,
  activeLeads: activeAll.filter((l) => activeLeadStages.includes(l.stage)).length,
  activeDeals: activeAll.filter((l) => !activeLeadStages.includes(l.stage)).length,
  stalled: stalledAll.length,
  stalledAcres: fmt(stalledAll.reduce((s, l) => s + parseAcres(l.acres), 0)),
  won: wonAll.length,
  wonAcres: fmt(wonAll.reduce((s, l) => s + parseAcres(l.acres), 0)),
  lost: lostAll.length,
  lostAcres: fmt(lostAll.reduce((s, l) => s + parseAcres(l.acres), 0)),
}

export default function ManagerPage() {
  return (
    <AuthGuard role="manager">
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f9fafb" }}>
        <Header />
        <main style={{ width: "100%", maxWidth: 1200, margin: "0 auto", flex: 1, padding: 32 }}>
          <Typography.Title level={3} style={{ marginBottom: 24, fontWeight: 600, color: "#111" }}>
            Team Dashboard
          </Typography.Title>

          {/* Row 1: Summary stats */}
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={8}>
              <Card title={<Typography.Text strong>Referrals</Typography.Text>} variant="bordered">
                <Stat label="Total across team" value={TOTALS.referrals} />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title={<Typography.Text strong>Active Leads</Typography.Text>} variant="bordered">
                <Stat label="Leads" value={TOTALS.activeLeads} />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card title={<Typography.Text strong>Active Deals</Typography.Text>} variant="bordered">
                <Stat label="Deals" value={TOTALS.activeDeals} />
              </Card>
            </Col>
          </Row>

          <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
            <Col xs={24} lg={8}>
              <Card
                title={<Space align="center"><ClockCircleFilled style={{ color: "#d97706" }} /><Typography.Text strong style={{ color: "#92400e" }}>Stalled</Typography.Text></Space>}
                variant="bordered"
              >
                <Row gutter={0} align="middle">
                  <Col span={12}><Stat label="Deals" value={TOTALS.stalled} /></Col>
                  <Col span={12}><Stat label="Acres" value={TOTALS.stalledAcres} /></Col>
                </Row>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card
                title={<Space align="center"><CheckCircleFilled style={{ color: "#52c41a" }} /><Typography.Text strong style={{ color: "#237804" }}>Won Deals</Typography.Text></Space>}
                variant="bordered"
              >
                <Row gutter={0} align="middle">
                  <Col span={12}><Stat label="Deals" value={TOTALS.won} /></Col>
                  <Col span={12}><Stat label="Acres" value={TOTALS.wonAcres} /></Col>
                </Row>
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card
                title={<Space align="center"><StopOutlined style={{ color: "#ff4d4f" }} /><Typography.Text strong style={{ color: "#a8071a" }}>Lost Deals</Typography.Text></Space>}
                variant="bordered"
              >
                <Row gutter={0} align="middle">
                  <Col span={12}><Stat label="Deals" value={TOTALS.lost} /></Col>
                  <Col span={12}><Stat label="Acres" value={TOTALS.lostAcres} /></Col>
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

          {/* Row 4: Team member breakdown */}
          <div style={{ marginTop: 32 }}>
            <Typography.Title level={5} style={{ marginBottom: 16, fontWeight: 600, color: "#374151" }}>
              Partner Performance
            </Typography.Title>
            <Card variant="bordered">
              <Table
                columns={columns}
                dataSource={partnerRows}
                rowKey="key"
                pagination={false}
              />
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </AuthGuard>
  )
}
