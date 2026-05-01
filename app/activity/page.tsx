"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AuthGuard } from "@/components/auth-guard"
import { leadsData, getStalledDate } from "@/lib/mock-data"
import { MOCK_USERS } from "@/lib/mock-users"
import { useUser } from "@/components/user-context"
import { Table, Tag, Select, Card, Row, Col, Typography, Space } from "antd"
import { ClockCircleFilled, StopOutlined, CheckCircleFilled } from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"

type EventType = "new_referral" | "stage_update" | "stalled" | "deal_won" | "deal_lost"

interface ActivityEvent {
  key: string
  date: string
  dateMs: number
  type: EventType
  leadName: string
  partnerName: string
  acres: string
  description: string
}

const partnerByCode: Record<string, string> = Object.fromEntries(
  MOCK_USERS.filter((u) => u.referralCode).map((u) => [u.referralCode!, u.name])
)

const stageLabel: Record<string, string> = {
  "Contact Form Submitted": "Contact Form Submitted",
  "Request for Services Submitted": "RFS Submitted",
  "Invitation Sent": "Invitation Sent",
  "Agreement Sent": "Agreement Sent",
  "Service Contract Under Review": "Service Contract Under Review",
  "Soil Data Collection": "Soil Data Collection",
  "Soil Team": "Soil Data Collection",
  "Soils Complete/Analyst Queue": "Soils Complete / Analyst Queue",
  "Analyst Team": "Analyst Team",
  "Report Complete": "Report Complete",
  "Report Complete/Not Paid": "Report Complete / Not Paid",
  "Report Review NOT PAID": "Report Complete / Not Paid",
  "Won": "Won",
}

function parseDate(dateStr: string): number {
  const [mm, dd, yyyy] = dateStr.split(/[\/-]/).map(Number)
  return new Date(yyyy, mm - 1, dd).getTime()
}

function formatDate(dateStr: string): string {
  const [mm, dd, yyyy] = dateStr.split(/[\/-]/)
  return `${(mm || "").padStart(2, "0")}/${(dd || "").padStart(2, "0")}/${yyyy}`
}

function buildActivityEvents(): ActivityEvent[] {
  const events: ActivityEvent[] = []

  for (const lead of leadsData) {
    const partnerName = partnerByCode[lead.referralCode ?? ""] ?? lead.referralCode ?? "-"
    events.push({
      key: `${lead.key}-new`,
      date: formatDate(lead.submissionDate),
      dateMs: parseDate(lead.submissionDate),
      type: "new_referral",
      leadName: lead.leadName,
      partnerName,
      acres: lead.acres,
      description: "New referral entered portal",
    })

    const stages = lead.progress?.stages ?? []
    stages.forEach((stage, i) => {
      if (!stage.date) return
      const label = stageLabel[stage.name] ?? stage.name
      events.push({
        key: `${lead.key}-stage-${i}`,
        date: formatDate(stage.date),
        dateMs: parseDate(stage.date),
        type: "stage_update",
        leadName: lead.leadName,
        partnerName,
        acres: lead.acres,
        description: `Moved to ${label}`,
      })
    })

    const stalledDate = getStalledDate(lead)
    if (stalledDate) {
      events.push({
        key: `${lead.key}-stalled`,
        date: formatDate(stalledDate),
        dateMs: parseDate(stalledDate),
        type: "stalled",
        leadName: lead.leadName,
        partnerName,
        acres: lead.acres,
        description: "Entered Stalled status",
      })
    }

    if (lead.stage === "Won" && lead.closedDate) {
      events.push({
        key: `${lead.key}-won`,
        date: formatDate(lead.closedDate),
        dateMs: parseDate(lead.closedDate),
        type: "deal_won",
        leadName: lead.leadName,
        partnerName,
        acres: lead.acres,
        description: "Deal won",
      })
    }

    if (lead.stage === "Lost" && lead.closedDate) {
      events.push({
        key: `${lead.key}-lost`,
        date: formatDate(lead.closedDate),
        dateMs: parseDate(lead.closedDate),
        type: "deal_lost",
        leadName: lead.leadName,
        partnerName,
        acres: lead.acres,
        description: lead.lostReason ? `Deal lost — ${lead.lostReason}` : "Deal lost",
      })
    }
  }

  const seen = new Set<string>()
  const deduped = events.filter((e) => {
    const id = `${e.leadName}|${e.dateMs}|${e.description}`
    if (seen.has(id)) return false
    seen.add(id)
    return true
  })

  return deduped.sort((a, b) => b.dateMs - a.dateMs)
}

const THIRTY_DAYS_AGO = Date.now() - 30 * 24 * 60 * 60 * 1000
const activityEvents = buildActivityEvents().filter((e) => e.dateMs >= THIRTY_DAYS_AGO)
const uniqueLeadNames = [...new Set(activityEvents.map((e) => e.leadName))].sort()

const typeConfig: Record<EventType, { label: string; color: string }> = {
  new_referral: { label: "New Referral", color: "blue" },
  stage_update: { label: "Stage Update", color: "default" },
  stalled: { label: "Stalled", color: "warning" },
  deal_won: { label: "Deal Won", color: "success" },
  deal_lost: { label: "Deal Lost", color: "error" },
}

const typeOptions = [
  { label: "New Referral", value: "new_referral" },
  { label: "Stage Update", value: "stage_update" },
  { label: "Stalled", value: "stalled" },
  { label: "Deal Won", value: "deal_won" },
  { label: "Deal Lost", value: "deal_lost" },
]

const leadOptions = uniqueLeadNames.map((name) => ({ label: name, value: name }))

const columns: ColumnsType<ActivityEvent> = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    width: 120,
    sorter: (a, b) => a.dateMs - b.dateMs,
    defaultSortOrder: "descend",
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    width: 140,
    render: (type: EventType) => {
      const { label, color } = typeConfig[type]
      return <Tag color={color}>{label}</Tag>
    },
    sorter: (a, b) => typeConfig[a.type].label.localeCompare(typeConfig[b.type].label),
  },
  {
    title: "Lead / Deal",
    dataIndex: "leadName",
    key: "leadName",
    sorter: (a, b) => a.leadName.localeCompare(b.leadName),
  },
  {
    title: "Details",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Acres",
    dataIndex: "acres",
    key: "acres",
    width: 120,
    sorter: (a, b) =>
      parseInt(a.acres.replace(/[^0-9]/g, "")) - parseInt(b.acres.replace(/[^0-9]/g, "")),
  },
]

const partnerColumn = {
  title: "Partner",
  dataIndex: "partnerName",
  key: "partnerName",
  sorter: (a: ActivityEvent, b: ActivityEvent) => a.partnerName.localeCompare(b.partnerName),
}

const partnerOptions = MOCK_USERS.filter((u) => u.role === "partner").map((u) => ({
  label: u.name,
  value: u.name,
}))

export default function ActivityPage() {
  const { user } = useUser()
  const isManager = user?.role === "manager"
  const [selectedTypes, setSelectedTypes] = useState<EventType[]>([])
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [selectedPartners, setSelectedPartners] = useState<string[]>([])

  const tableColumns = isManager
    ? [columns[0], columns[1], columns[2], partnerColumn, columns[3], columns[4]]
    : columns

  const filteredEvents = useMemo(() => {
    return activityEvents.filter((e) => {
      if (selectedTypes.length > 0 && !selectedTypes.includes(e.type)) return false
      if (selectedLeads.length > 0 && !selectedLeads.includes(e.leadName)) return false
      if (selectedPartners.length > 0 && !selectedPartners.includes(e.partnerName)) return false
      return true
    })
  }, [selectedTypes, selectedLeads, selectedPartners])

  const parseAcres = (acresStr: string) => parseInt(acresStr.replace(/[^0-9]/g, "") || "0", 10)
  const fmt = (n: number) => n.toLocaleString()

  const newReferralEvents = filteredEvents.filter((e) => e.type === "new_referral")
  const stalledEvents = filteredEvents.filter((e) => e.type === "stalled")
  const dealsLostEvents = filteredEvents.filter((e) => e.type === "deal_lost")
  const dealsWonEvents = filteredEvents.filter((e) => e.type === "deal_won")

  const SUMMARY = {
    newReferrals: { count: newReferralEvents.length, acres: fmt(newReferralEvents.reduce((s, e) => s + parseAcres(e.acres), 0)) },
    stalled:      { count: stalledEvents.length,      acres: fmt(stalledEvents.reduce((s, e) => s + parseAcres(e.acres), 0)) },
    dealsLost:    { count: dealsLostEvents.length,    acres: fmt(dealsLostEvents.reduce((s, e) => s + parseAcres(e.acres), 0)) },
    dealsWon:     { count: dealsWonEvents.length,     acres: fmt(dealsWonEvents.reduce((s, e) => s + parseAcres(e.acres), 0)) },
  }

  return (
    <AuthGuard>
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main style={{ width: "100%", maxWidth: 1200, margin: "0 auto", flex: 1, padding: 32 }}>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Recent Activity</h1>
          <div className="flex gap-3">
            <Select
              mode="multiple"
              allowClear
              placeholder="All Types"
              options={typeOptions}
              value={selectedTypes}
              onChange={setSelectedTypes}
              style={{ minWidth: 180 }}
              maxTagCount="responsive"
            />
            <Select
              mode="multiple"
              allowClear
              placeholder="All Leads / Deals"
              options={leadOptions}
              value={selectedLeads}
              onChange={setSelectedLeads}
              style={{ minWidth: 220 }}
              maxTagCount="responsive"
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
            />
            {isManager && (
              <Select
                mode="multiple"
                allowClear
                placeholder="All Partners"
                options={partnerOptions}
                value={selectedPartners}
                onChange={setSelectedPartners}
                style={{ minWidth: 180 }}
                maxTagCount="responsive"
              />
            )}
          </div>
        </div>
        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
          <Col xs={24} lg={6}>
            <Card title={<Typography.Text strong>New Referrals</Typography.Text>} variant="bordered">
              <Row gutter={0} align="middle">
                <Col span={12}>
                  <Space direction="vertical" size={2} style={{ width: "100%" }}>
                    <Typography.Title level={2} style={{ margin: 0, fontWeight: 600, fontSize: 36, lineHeight: 1 }}>{SUMMARY.newReferrals.count}</Typography.Title>
                    <Typography.Text type="secondary" style={{ fontSize: 14 }}>Referrals</Typography.Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical" size={2} style={{ width: "100%" }}>
                    <Typography.Title level={2} style={{ margin: 0, fontWeight: 600, fontSize: 36, lineHeight: 1 }}>{SUMMARY.newReferrals.acres}</Typography.Title>
                    <Typography.Text type="secondary" style={{ fontSize: 14 }}>Acres</Typography.Text>
                  </Space>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} lg={6}>
            <Card
              title={<Space align="center"><ClockCircleFilled style={{ color: "#d97706" }} /><Typography.Text strong style={{ color: "#92400e" }}>Stalled</Typography.Text></Space>}
              variant="bordered"
            >
              <Row gutter={0} align="middle">
                <Col span={12}>
                  <Space direction="vertical" size={2} style={{ width: "100%" }}>
                    <Typography.Title level={2} style={{ margin: 0, fontWeight: 600, fontSize: 36, lineHeight: 1 }}>{SUMMARY.stalled.count}</Typography.Title>
                    <Typography.Text type="secondary" style={{ fontSize: 14 }}>Deals</Typography.Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical" size={2} style={{ width: "100%" }}>
                    <Typography.Title level={2} style={{ margin: 0, fontWeight: 600, fontSize: 36, lineHeight: 1 }}>{SUMMARY.stalled.acres}</Typography.Title>
                    <Typography.Text type="secondary" style={{ fontSize: 14 }}>Acres</Typography.Text>
                  </Space>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} lg={6}>
            <Card
              title={<Space align="center"><StopOutlined style={{ color: "#ff4d4f" }} /><Typography.Text strong style={{ color: "#a8071a" }}>Deals Lost</Typography.Text></Space>}
              variant="bordered"
            >
              <Row gutter={0} align="middle">
                <Col span={12}>
                  <Space direction="vertical" size={2} style={{ width: "100%" }}>
                    <Typography.Title level={2} style={{ margin: 0, fontWeight: 600, fontSize: 36, lineHeight: 1 }}>{SUMMARY.dealsLost.count}</Typography.Title>
                    <Typography.Text type="secondary" style={{ fontSize: 14 }}>Deals</Typography.Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical" size={2} style={{ width: "100%" }}>
                    <Typography.Title level={2} style={{ margin: 0, fontWeight: 600, fontSize: 36, lineHeight: 1 }}>{SUMMARY.dealsLost.acres}</Typography.Title>
                    <Typography.Text type="secondary" style={{ fontSize: 14 }}>Acres</Typography.Text>
                  </Space>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col xs={24} lg={6}>
            <Card
              title={<Space align="center"><CheckCircleFilled style={{ color: "#52c41a" }} /><Typography.Text strong style={{ color: "#237804" }}>Won Deals</Typography.Text></Space>}
              variant="bordered"
            >
              <Row gutter={0} align="middle">
                <Col span={12}>
                  <Space direction="vertical" size={2} style={{ width: "100%" }}>
                    <Typography.Title level={2} style={{ margin: 0, fontWeight: 600, fontSize: 36, lineHeight: 1 }}>{SUMMARY.dealsWon.count}</Typography.Title>
                    <Typography.Text type="secondary" style={{ fontSize: 14 }}>Deals</Typography.Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical" size={2} style={{ width: "100%" }}>
                    <Typography.Title level={2} style={{ margin: 0, fontWeight: 600, fontSize: 36, lineHeight: 1 }}>{SUMMARY.dealsWon.acres}</Typography.Title>
                    <Typography.Text type="secondary" style={{ fontSize: 14 }}>Acres</Typography.Text>
                  </Space>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Table
          columns={tableColumns}
          dataSource={filteredEvents}
          rowKey="key"
          pagination={{ pageSize: 25, showSizeChanger: true }}
        />
      </main>
      <Footer />
    </div>
    </AuthGuard>
  )
}
