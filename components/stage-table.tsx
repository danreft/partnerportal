"use client"

import { Card, Table, Typography } from "antd"
import { leadsData } from "@/lib/mock-data"

type BucketKey =
  | "Contact Information"
  | "Invitation Sent"
  | "RFS Submitted"
  | "Agreement Sent"
  | "Soil Data Collection"
  | "Analyst Team"
  | "Report Complete | Not Paid"

const leadStages: BucketKey[] = ["Contact Information", "Invitation Sent"]
const dealStages: BucketKey[] = [
  "RFS Submitted",
  "Agreement Sent",
  "Soil Data Collection",
  "Analyst Team",
  "Report Complete | Not Paid",
]

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
  "Contact Information": "Contact Information",
  "Invitation Sent": "Invitation Sent",
  "Agreement Sent": "Agreement Sent",
  "Soil Data Collection": "Soil Data Collection",
  "Report Complete | Not Paid": "Report Complete | Not Paid",
}

const parseAcres = (acres: string) => {
  const digits = acres.replace(/[^0-9]/g, "")
  return digits ? parseInt(digits, 10) : 0
}

function buildTableData() {
  const activeLeads = leadsData.filter((l) => l.stage !== "Won" && l.stage !== "Lost")
  const buckets: Record<BucketKey, { deals: number; acres: number }> = Object.fromEntries(
    [...leadStages, ...dealStages].map((k) => [k, { deals: 0, acres: 0 }])
  ) as Record<BucketKey, { deals: number; acres: number }>

  for (const lead of activeLeads) {
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
    const key = pipedriveToBucket[stageName] || "Contact Information"
    buckets[key].deals += 1
    buckets[key].acres += parseAcres(lead.acres)
  }

  return [
    { key: "leads-header", section: "Leads", isHeader: true },
    ...leadStages.map((stage) => ({
      key: `lead-${stage}`,
      stage,
      deals: buckets[stage].deals,
      acres: buckets[stage].acres,
      isHeader: false,
    })),
    { key: "deals-header", section: "Deals", isHeader: true },
    ...dealStages.map((stage) => ({
      key: `deal-${stage}`,
      stage,
      deals: buckets[stage].deals,
      acres: buckets[stage].acres,
      isHeader: false,
    })),
  ]
}

const tableData = buildTableData()

const stageColumns = [
  {
    title: "",
    dataIndex: "stage",
    key: "stage",
    onCell: (record: any) => (record.isHeader ? { colSpan: 3 } : {}),
    render: (text: string, record: any) =>
      record.isHeader ? <Typography.Text strong>{record.section} by Stage</Typography.Text> : text,
  },
  {
    title: "Leads / Deals",
    dataIndex: "deals",
    key: "deals",
    align: "left" as const,
    onCell: (record: any) => (record.isHeader ? { colSpan: 0 } : {}),
    render: (_: any, record: any) => (record.isHeader ? null : record.deals),
  },
  {
    title: "Acres",
    dataIndex: "acres",
    key: "acres",
    align: "left" as const,
    onCell: (record: any) => (record.isHeader ? { colSpan: 0 } : {}),
    render: (_: any, record: any) => (record.isHeader ? null : record.acres),
  },
]

export function StageTable() {
  return (
    <Card style={{ flex: 1 }} variant="bordered">
      <Table
        columns={stageColumns}
        dataSource={tableData}
        pagination={false}
        rowKey="key"
        rowClassName={(record) => (record.isHeader ? "ant-table-row-section-header" : "")}
      />
    </Card>
  )
}
