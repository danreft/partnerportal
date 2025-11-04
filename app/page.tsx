"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { leadsData } from "@/lib/mock-data"
import { Card, Table, Typography } from "antd"
import { CheckCircleFilled, StopOutlined } from "@ant-design/icons"

import { Row, Col, Space } from "antd"

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

  const REFERRALS = referrals
  const WON = {
    deals: wonLeads.length,
    acres: wonLeads.reduce((sum, l) => sum + parseAcres(l.acres), 0),
  }
  const LOST = {
    deals: lostLeads.length,
    acres: lostLeads.reduce((sum, l) => sum + parseAcres(l.acres), 0),
  }

  // Stage table: derive current/furthest stage for active leads and map to display buckets using Partner Portal <-> Pipedrive mapping
  type BucketKey =
    | "Contact Information"
    | "Invitation Sent"
    | "RFS Submitted"
    | "Agreement Sent"
    | "Soil Data Collection"
    | "Analyst Team"
    | "Report Complete | Not Paid"

  // Revised: Split stages into Leads and Deals per new requirements
  const leadStages: BucketKey[] = [
    "Contact Information",
    "Invitation Sent",
  ]
  const dealStages: BucketKey[] = [
    "RFS Submitted",
    "Agreement Sent",
    "Soil Data Collection",
    "Analyst Team",
    "Report Complete | Not Paid",
  ]

  // Map Pipedrive stages to Partner Portal buckets
  const pipedriveToBucket: Record<string, BucketKey> = {
    "Inbound Calls": "Contact Information",
    "Inbound Contact Forms": "Contact Information",
    "Invitation Email": "Invitation Sent",
    "RFS Qualified, Paused": "Invitation Sent",
    "RFS Submitted": "RFS Submitted",
    "Docusign": "Agreement Sent",
    "Soil Team": "Soil Data Collection",
    "Soils Complete/Analyst Queue": "Soil Data Collection",
    "Analyst Team": "Analyst Team",
    "Report Complete": "Analyst Team",
    "Report Review NOT PAID": "Report Complete | Not Paid",
    // fallback for direct stage names
    "Contact Information": "Contact Information",
    "Invitation Sent": "Invitation Sent",
    "Agreement Sent": "Agreement Sent",
    "Soil Data Collection": "Soil Data Collection",
    "Report Complete | Not Paid": "Report Complete | Not Paid",
  }

  const buckets: Record<BucketKey, { deals: number; acres: number }> = Object.fromEntries(
    [...leadStages, ...dealStages].map((k) => [k, { deals: 0, acres: 0 }])
  ) as Record<BucketKey, { deals: number; acres: number }>

  for (const lead of activeLeads) {
    // Try to use crmStage, then progress, then stage
    let stageName = lead.crmStage || ""
    if (!stageName && lead.progress?.stages) {
      const stages = lead.progress.stages
      const current = stages.find((s) => s.current)
      const completed = stages.filter((s) => s.completed)
      const lastCompleted = completed.length ? completed[completed.length - 1] : undefined
      stageName = (current?.name || lastCompleted?.name || lead.stage || "").trim()
    } else if (!stageName) {
      stageName = lead.stage || ""
    }

    // Map to bucket
    const key = pipedriveToBucket[stageName] || "Contact Information"
    buckets[key].deals += 1
    buckets[key].acres += parseAcres(lead.acres)
  }

  // Combine for single table with section headers
  const tableData = [
    { key: 'leads-header', section: 'Leads', isHeader: true },
    ...leadStages.map((stage) => ({
      key: `lead-${stage}`,
      stage,
      deals: buckets[stage].deals,
      acres: buckets[stage].acres,
      isHeader: false,
    })),
    { key: 'deals-header', section: 'Deals', isHeader: true },
    ...dealStages.map((stage) => ({
      key: `deal-${stage}`,
      stage,
      deals: buckets[stage].deals,
      acres: buckets[stage].acres,
      isHeader: false,
    })),
  ]

  const stageColumns = [
    {
      title: '',
      dataIndex: 'stage',
      key: 'stage',
      render: (text: string, record: any) => {
        if (record.isHeader) {
          return {
            children: <Typography.Text strong>{record.section} by Stage</Typography.Text>,
            props: { colSpan: 3 },
          }
        }
        return text
      },
    },
    {
      title: 'Leads / Deals',
      dataIndex: 'deals',
      key: 'deals',
      align: 'left' as const,
      render: (_: any, record: any) => (record.isHeader ? { children: null, props: { colSpan: 0 } } : record.deals),
    },
    {
      title: 'Acres',
      dataIndex: 'acres',
      key: 'acres',
      align: 'left' as const,
      render: (_: any, record: any) => (record.isHeader ? { children: null, props: { colSpan: 0 } } : record.acres),
    },
  ]

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f9fafb" }}>
      <Header />
      <main style={{ width: "100%", maxWidth: 1200, margin: "0 auto", flex: 1, padding: 32 }}>
        <Typography.Title level={3} style={{ marginBottom: 24, fontWeight: 600, color: "#111" }}>Dashboard</Typography.Title>
        {/* Row 1: Referrals, Active Leads, Active Deals */}
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            <Card title={<Typography.Text strong>Referrals</Typography.Text>} bordered>
              <Stat label="Received" value={REFERRALS} />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title={<Typography.Text strong>Active Leads</Typography.Text>} bordered>
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
            <Card title={<Typography.Text strong>Active Deals</Typography.Text>} bordered>
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
        {/* Row 2: Status Table (single compact table with sections) and Won/Lost Cards */}
        <Row gutter={[24, 24]} style={{ marginTop: 24 }} align="stretch">
          <Col xs={24} lg={16} style={{ display: "flex", flexDirection: "column" }}>
            <Card style={{ flex: 1 }} bordered>
              <Table
                columns={stageColumns}
                dataSource={tableData}
                pagination={false}
                size="small"
                rowKey="key"
                rowClassName={(record) => record.isHeader ? 'ant-table-row-section-header' : ''}
              />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Row gutter={[0, 24]}>
              <Col span={24}>
                <Card
                  title={<Space align="center"><CheckCircleFilled style={{ color: "#52c41a" }} /> <Typography.Text strong style={{ color: "#237804" }}>Won Deals</Typography.Text></Space>}
                  bordered
                >
                  <Row gutter={0} align="middle">
                    <Col span={12}>
                      <Stat label="Deals" value={WON.deals} />
                    </Col>
                    <Col span={12}>
                      <Stat label="Acres" value={fmt(WON.acres)} />
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col span={24}>
                <Card
                  title={<Space align="center"><StopOutlined style={{ color: "#ff4d4f" }} /> <Typography.Text strong style={{ color: "#a8071a" }}>Lost Deals</Typography.Text></Space>}
                  bordered
                >
                  <Row gutter={0} align="middle">
                    <Col span={12}>
                      <Stat label="Deals" value={LOST.deals} />
                    </Col>
                    <Col span={12}>
                      <Stat label="Acres" value={fmt(LOST.acres)} />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </main>
      <Footer />
    </div>
  )
}
