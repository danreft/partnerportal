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

  const IN_PROCESS = {
    deals: activeLeads.length,
    acres: fmt(activeLeads.reduce((sum, l) => sum + parseAcres(l.acres), 0)),
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

  // Stage table: derive current/furthest stage for active leads and map to 5 display buckets
  type BucketKey =
    | "RFS Submitted"
    | "Agreement Sent"
    | "Soil Data Collection"
    | "Analyst Team"
    | "Report Complete | Not Paid"

  const order: BucketKey[] = [
    "RFS Submitted",
    "Agreement Sent",
    "Soil Data Collection",
    "Analyst Team",
    "Report Complete | Not Paid",
  ]

  const buckets: Record<BucketKey, { deals: number; acres: number }> = Object.fromEntries(
    order.map((k) => [k, { deals: 0, acres: 0 }])
  ) as Record<BucketKey, { deals: number; acres: number }>

  for (const lead of activeLeads) {
    const stages = lead.progress?.stages ?? []
    const current = stages.find((s) => s.current)
    const completed = stages.filter((s) => s.completed)
    const lastCompleted = completed.length ? completed[completed.length - 1] : undefined
    const stageName = (current?.name || lastCompleted?.name || lead.stage || "").trim()

    let key: BucketKey
    switch (stageName) {
      case "Request for Services Submitted":
      case "Contact Form Submitted":
        key = "RFS Submitted"
        break
      case "Agreement Sent":
      case "Service Contract Under Review":
        key = "Agreement Sent"
        break
      case "Soil Data Collection":
        key = "Soil Data Collection"
        break
      case "Analyst Team":
        key = "Analyst Team"
        break
      case "Report Complete/Not Paid":
        key = "Report Complete | Not Paid"
        break
      default:
        // Map other early-stage labels into the first bucket
        key = "RFS Submitted"
    }

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
          {/* Row 1: Left In-Process card (combined) and Right referrals */}
          <div className="lg:col-span-2">
            <Card title={<span className="text-gray-800">In-Process</span>} variant="outlined">
              <div className="flex items-stretch divide-x divide-gray-200">
                <div className="flex-none w-[220px] sm:w-[260px] pr-6 sm:pr-8">
                  <Stat label="Deals" value={IN_PROCESS.deals} />
                </div>
                <div className="flex-1 pl-6 sm:pl-8">
                  <Stat label="Acres" value={IN_PROCESS.acres} />
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card title={<span className="text-gray-800">Referrals</span>} variant="outlined">
              <Stat label="Received" value={REFERRALS} />
            </Card>
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

          <div className="flex h-full flex-col justify-between gap-4">
            <Card
              title={
                <span className="flex items-center gap-2 text-base text-gray-800">
                  <CheckCircleFilled className="text-green-600" /> Won
                </span>
              }
            >
              <div className="flex items-stretch divide-x divide-gray-200">
                <div className="flex-1 pr-6">
                  <Stat label="Deals" value={WON.deals} />
                </div>
                <div className="flex-1 pl-6">
                  <Stat label="Acres" value={fmt(WON.acres)} />
                </div>
              </div>
            </Card>

            <Card
              title={
                <span className="flex items-center gap-2 text-base text-gray-800">
                  <StopOutlined className="text-red-600" /> Lost
                </span>
              }
            >
              <div className="flex items-stretch divide-x divide-gray-200">
                <div className="flex-1 pr-6">
                  <Stat label="Deals" value={LOST.deals} />
                </div>
                <div className="flex-1 pl-6">
                  <Stat label="Acres" value={fmt(LOST.acres)} />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
