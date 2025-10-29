"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { leadsData } from "@/lib/mock-data"
import { Card, Table, Typography } from "antd"
import { CheckCircleFilled, StopOutlined } from "@ant-design/icons"

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex flex-col">
      <div className="text-4xl font-semibold leading-none tracking-tight">{value}</div>
      <div className="mt-1 text-sm text-gray-500">{label}</div>
    </div>
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

  const order: BucketKey[] = [
    "Contact Information",
    "Invitation Sent",
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
    order.map((k) => [k, { deals: 0, acres: 0 }])
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

  const stageRows = order.map((stage) => ({
    key: stage,
    stage,
    deals: buckets[stage].deals,
    acres: buckets[stage].acres,
  }))

  const stageColumns = [
    { title: "Stage", dataIndex: "stage", key: "stage" },
    { title: "Deals", dataIndex: "deals", key: "deals", align: "left" as const },
    { title: "Acres", dataIndex: "acres", key: "acres", align: "left" as const },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 py-8">
        <h1 className="mb-4 text-2xl font-semibold text-gray-900">Dashboard</h1>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-[auto_1fr]">
          {/* Row 1: Referrals, then Active Leads, then Active Deals */}
          <div>
            <Card title={<span className="text-gray-800">Referrals</span>} variant="outlined">
              <Stat label="Received" value={REFERRALS} />
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card title={<span className="text-gray-800">Active Leads</span>} variant="outlined">
              <div className="flex items-stretch divide-x divide-gray-200">
                <div className="flex-1 pr-6">
                  <Stat label="Leads" value={ACTIVE_LEADS.deals} />
                </div>
                <div className="flex-1 pl-6">
                  <Stat label="Acres" value={ACTIVE_LEADS.acres} />
                </div>
              </div>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card title={<span className="text-gray-800">Active Deals</span>} variant="outlined">
              <div className="flex items-stretch divide-x divide-gray-200">
                <div className="flex-1 pr-6">
                  <Stat label="Deals" value={ACTIVE_DEALS.deals} />
                </div>
                <div className="flex-1 pl-6">
                  <Stat label="Acres" value={ACTIVE_DEALS.acres} />
                </div>
              </div>
            </Card>
          </div>
        </div>
        {/* Row 2: Left status table (span 2 cols) and Right Won/Lost stacked filling full height */}
        <div className="lg:col-span-2">
          <Card className="h-full overflow-hidden" title={<span className="text-gray-800">Status by Stage</span>}>
            <Table
              columns={stageColumns}
              dataSource={stageRows}
              pagination={false}
              size="small"
              rowKey="key"
            />
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
