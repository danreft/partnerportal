"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { DatePicker, Input, Table, Tabs } from "antd"
import { UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import { leadsData, type LeadData } from "@/lib/mock-data"
import dayjs, { type Dayjs } from "dayjs"
import { useState, useMemo } from "react"

// Global constants used for business filtering in the Leads tab
const RP_REFERRAL_CODE = "JSMITH2024"
const CRM_ALLOWED_STAGES = [
  "Inbound Calls",
  "Inbound Contact Forms",
  "Invitation Email",
  "RFS Qualified Paused",
] as const
const REQUIRED_PIPELINE = "Soil Nutrient Load Pipeline"

export default function ReferralsPage() {
  const [searchText, setSearchText] = useState("")
  const [submissionRange, setSubmissionRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null)
  const [activeTab, setActiveTab] = useState("0")

  // Helper to format dates to MM-DD-YY from existing mock strings (MM/DD/YYYY)
  const formatMMDDYY = (input?: string) => {
    if (!input) return "-"
    const parts = input.split(/[\/-]/)
    if (parts.length < 3) return input
    const [mm, dd, yyyy] = parts
    const yy = (yyyy || "").slice(-2)
    const mm2 = (mm || "").padStart(2, "0")
    const dd2 = (dd || "").padStart(2, "0")
    return `${mm2}-${dd2}-${yy}`
  }

  // Helper to format dates to MM/DD/YYYY
  const formatMMDDYYYY = (input?: string) => {
    if (!input) return "-"
    const parts = input.split(/[\/-]/)
    if (parts.length < 3) return input
    const [mm, dd, yyyy] = parts
    const mm2 = (mm || "").padStart(2, "0")
    const dd2 = (dd || "").padStart(2, "0")
    const yyyy2 = (yyyy || "").padStart(4, "0")
    return `${mm2}/${dd2}/${yyyy2}`
  }

  // Search-only base filter (date filtering is applied per-tab so Won can use Closed Date)
  const searchFiltered = useMemo(() => {
    const query = searchText.trim().toLowerCase()
    return leadsData.filter((lead) => {
      const haystack = [
        lead.leadName,
        lead.acres,
        lead.submissionDate,
        lead.closedDate || "",
        lead.stage,
        lead.lostReason || "",
        lead.contact.name,
        lead.contact.email,
        lead.contact.phone,
      ]
        .join(" ")
        .toLowerCase()

      return query === "" || haystack.includes(query)
    })
  }, [searchText])

  // Helpers to apply the current date range against different date fields
  const isWithinRange = (dateStr?: string | null) => {
    if (!submissionRange || (!submissionRange[0] && !submissionRange[1])) return true
    if (!dateStr) return false
    const time = new Date(dateStr).getTime()
    const start = submissionRange[0]?.startOf("day").valueOf()
    const end = submissionRange[1]?.endOf("day").valueOf()
    if (start != null && end != null) return time >= start && time <= end
    if (start != null) return time >= start
    if (end != null) return time <= end
    return true
  }

  // Split filtered data into Active (non-Lost) and Lost buckets
  const activeData = useMemo(
    () =>
      searchFiltered.filter(
        (l) => l.stage !== "Lost" && l.stage !== "Won" && isWithinRange(l.submissionDate)
      ),
    [searchFiltered, submissionRange]
  )
  const lostData = useMemo(
    () => searchFiltered.filter((l) => l.stage === "Lost" && isWithinRange(l.closedDate)),
    [searchFiltered, submissionRange]
  )
  // Won tab should filter by Closed Date
  const completedData = useMemo(
    () => searchFiltered.filter((l) => l.stage === "Won" && isWithinRange(l.closedDate)),
    [searchFiltered, submissionRange]
  )

  // Helper to determine Open status (falls back to stage if dealStatus missing)
  const isOpen = (lead: LeadData) => {
    if (lead.dealStatus) return lead.dealStatus === "Open"
    return lead.stage !== "Won" && lead.stage !== "Lost"
  }

  // Derive a business stage for filtering/display similar to dashboard aggregation
  const deriveStage = (lead: LeadData) => {
    const stages = lead.progress?.stages ?? []
    const current = stages.find((s) => s.current)
    const completed = stages.filter((s) => s.completed)
    const lastCompleted = completed.length ? completed[completed.length - 1] : undefined
    return (current?.name || lastCompleted?.name || lead.stage || "").trim()
  }

  // Active Deals tab filter: limit to the requested stages and Deal status = Open
  const ACTIVE_ALLOWED_STAGES = new Set<string>([
    // Provided business stages (and their synonyms as they appear in our mock data)
    "RFS Submitted",
    "Request for Services Submitted",
    "Contact Form Submitted",
    "Docusign",
    "Agreement Sent",
    "Service Contract Under Review",
    "Soil Team",
    "Soil Data Collection",
    "Soils Complete/Analyst Queue",
    "Analyst Team",
    "Report Complete",
    "Report Complete/Not Paid",
    "Report Review NOT PAID",
  ])

  const activeDealsFiltered = useMemo(
    () =>
      activeData.filter((lead) => {
        if (!isOpen(lead)) return false
        const stageName = deriveStage(lead)
        return ACTIVE_ALLOWED_STAGES.has(stageName)
      }),
    [activeData]
  )

  // Leads tab specific filter: RP referral code, pipeline, CRM stage in allowed list, and deal status Open
  const leadsTabData = useMemo(() => {
    const isOpen = (lead: LeadData) => {
      if (lead.dealStatus) return lead.dealStatus === "Open"
      return lead.stage !== "Won" && lead.stage !== "Lost"
    }
    return searchFiltered.filter(
      (lead) =>
        lead.referralCode === RP_REFERRAL_CODE &&
        lead.pipeline === REQUIRED_PIPELINE &&
        !!lead.crmStage && CRM_ALLOWED_STAGES.includes(lead.crmStage as any) &&
        isOpen(lead) &&
        isWithinRange(lead.submissionDate)
    )
  }, [searchFiltered, submissionRange])

  // CSV export removed per request

  // Removed stage filter: keep stages only for display in table rows

  const expandedRowRender = (record: LeadData) => {
    const hasProgress = Boolean(record.progress)

    // Contact-only section used for Lost and for records without progress
    const contactSection = (
      <div className="mb-3 grid grid-cols-3 gap-4">
        <div className="flex items-start gap-2">
          <UserOutlined className="text-gray-400" />
          <div>
            <div className="text-xs text-gray-500">Contact</div>
            <div className="font-medium">{record.contact.name}</div>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MailOutlined className="text-gray-400" />
          <div>
            <div className="text-xs text-gray-500">Email</div>
            <div className="font-medium">{record.contact.email}</div>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <PhoneOutlined className="text-gray-400" />
          <div>
            <div className="text-xs text-gray-500">Phone</div>
            <div className="font-medium">{record.contact.phone}</div>
          </div>
        </div>
      </div>
    )

    // If Lost or no progress, show only contact info
    if (record.stage === "Lost" || !hasProgress) {
      return <div className="px-6 py-3">{contactSection}</div>
    }

    const completedStages = record.progress!.stages.filter((s) => s.completed).length
    const totalStages = record.progress!.stages.length
    const currentIndex = record.progress!.stages.findIndex((s) => s.current)
    const nextIndex = currentIndex >= 0 && currentIndex + 1 < totalStages ? currentIndex + 1 : -1

    return (
      <div className="px-6 py-3">
        {contactSection}
        <div className="relative">
          <div
            className="mb-2 grid h-2 w-full overflow-hidden rounded-full"
            style={{ gridTemplateColumns: `repeat(${totalStages}, minmax(0, 1fr))`, gap: 2 }}
          >
            {record.progress!.stages.map((_, i) => (
              <div
                key={i}
                className={
                  i < completedStages
                    ? "bg-green-600"
                    : i === nextIndex
                      ? "bg-gray-400"
                      : "bg-gray-200"
                }
              />
            ))}
          </div>
          <div className="flex justify-between">
            {record.progress!.stages.map((stage, index) => (
              <div
                key={index}
                className="flex flex-col items-center"
                style={{ width: `${100 / record.progress!.stages.length}%` }}
              >
                <div className="mb-2">
                  {stage.completed ? (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">
                      ✓
                    </div>
                  ) : stage.current ? (
                    <div className="h-5 w-5 rounded-full border-4 border-green-600 bg-white" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-gray-300 bg-white" />
                  )}
                </div>
                <div className="text-center text-xs font-medium text-gray-700">{stage.name}</div>
                {stage.date && <div className="text-xs text-gray-500">{stage.date}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const columns: ColumnsType<LeadData> = [
    {
      title: "Lead Name",
      dataIndex: "leadName",
      key: "leadName",
      sorter: (a, b) => a.leadName.localeCompare(b.leadName),
    },
    {
      title: "Acres",
      dataIndex: "acres",
      key: "acres",
      sorter: (a, b) => {
        const aNum = Number.parseInt(a.acres.replace(/[^0-9]/g, ""))
        const bNum = Number.parseInt(b.acres.replace(/[^0-9]/g, ""))
        return aNum - bNum
      },
    },
    {
      title: "Submission Date",
      dataIndex: "submissionDate",
      key: "submissionDate",
      render: (date: string) => <span className="text-gray-800">{formatMMDDYYYY(date)}</span>,
      sorter: (a, b) => new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime(),
    },
    {
      title: "Stage",
      dataIndex: "stage",
      key: "stage",
      render: (stage: string, record: LeadData) => {
        const colorClass =
          record.stageColor === "blue"
            ? "bg-blue-500"
            : record.stageColor === "purple"
              ? "bg-purple-600"
              : record.stageColor === "orange"
                ? "bg-amber-600"
                : record.stageColor === "red"
                  ? "bg-red-500"
                  : record.stageColor === "green"
                    ? "bg-green-600"
                    : "bg-gray-400"
        const label = stage === "Lost" && record.lostReason ? `Lost - ${record.lostReason}` : stage
        return (
          <div className="flex items-center gap-2">
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${colorClass}`} />
            <span className="text-gray-800">{label}</span>
          </div>
        )
      },
      sorter: (a, b) => a.stage.localeCompare(b.stage),
    },
  ]

  // Map underlying progress/stage names to requested business labels for Active Deals display
  const mapToBusinessStage = (name: string) => {
    switch (name) {
      case "Request for Services Submitted":
      case "Contact Form Submitted":
      case "RFS Submitted":
        return "RFS Submitted"
      case "Agreement Sent":
      case "Service Contract Under Review":
      case "Docusign":
        return "Docusign"
      case "Soil Data Collection":
      case "Soil Team":
        return "Soil Team"
      case "Soils Complete/Analyst Queue":
        return "Soils Complete/Analyst Queue"
      case "Analyst Team":
        return "Analyst Team"
      case "Report Complete":
        return "Report Complete"
      case "Report Complete/Not Paid":
      case "Report Review NOT PAID":
        return "Report Review NOT PAID"
      default:
        return name
    }
  }

  // Active Deals columns: show business stage labels based on derived stage
  const activeColumns: ColumnsType<LeadData> = [
    {
      ...columns[0],
    },
    {
      ...columns[1],
    },
    {
      ...columns[2],
    },
    {
      ...columns[3],
      render: (_stage: string, record: LeadData) => {
        const colorClass =
          record.stageColor === "blue"
            ? "bg-blue-500"
            : record.stageColor === "purple"
              ? "bg-purple-600"
              : record.stageColor === "orange"
                ? "bg-amber-600"
                : record.stageColor === "red"
                  ? "bg-red-500"
                  : record.stageColor === "green"
                    ? "bg-green-600"
                    : "bg-gray-400"
        const derived = deriveStage(record)
        const label = mapToBusinessStage(derived)
        return (
          <div className="flex items-center gap-2">
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${colorClass}`} />
            <span className="text-gray-800">{label}</span>
          </div>
        )
      },
    },
  ]

  // Lost-only columns: add Closed Date to the right of Stage
  const lostColumns: ColumnsType<LeadData> = [
    ...columns,
    {
      title: "Closed Date",
      key: "closedDate",
      dataIndex: "closedDate",
      render: (_: any, record: LeadData) => {
        return <span className="text-gray-800">{formatMMDDYY(record.closedDate)}</span>
      },
      sorter: (a, b) => new Date(a.closedDate || 0).getTime() - new Date(b.closedDate || 0).getTime(),
    },
  ]

  // Won-only columns: add Closed Date to the right of Stage
  const wonColumns: ColumnsType<LeadData> = [
    ...columns,
    {
      title: "Closed Date",
      key: "closedDate",
      dataIndex: "closedDate",
      render: (_: any, record: LeadData) => {
        return <span className="text-gray-800">{formatMMDDYY(record.closedDate)}</span>
      },
      sorter: (a, b) => new Date(a.closedDate || 0).getTime() - new Date(b.closedDate || 0).getTime(),
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="flex-1 px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Referrals</h1>
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-end gap-3">
              <Input
                placeholder="Search..."
                style={{ width: 260 }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
              <div className="flex flex-col gap-1">
                <div className="text-[11px] text-gray-500 whitespace-nowrap">
                  Filter by: {activeTab === "2" || activeTab === "3" ? "Closed Date" : "Submission Date"}
                </div>
                <DatePicker.RangePicker
                  value={submissionRange}
                  onChange={setSubmissionRange}
                  allowClear
                  placeholder={["From", "To"]}
                  format="MM-DD-YY"
                  separator=" > "
                  presets={[
                    { label: "Today", value: [dayjs().startOf("day"), dayjs().endOf("day")] },
                    {
                      label: "Last 7 Days",
                      value: [dayjs().subtract(6, "day").startOf("day"), dayjs().endOf("day")],
                    },
                    {
                      label: "This Month",
                      value: [dayjs().startOf("month"), dayjs().endOf("month")],
                    },
                    {
                      label: "Last Month",
                      value: [
                        dayjs().subtract(1, "month").startOf("month"),
                        dayjs().subtract(1, "month").endOf("month"),
                      ],
                    },
                    {
                      label: "This Year",
                      value: [dayjs().startOf("year"), dayjs().endOf("year")],
                    },
                  ]}
                  renderExtraFooter={() => (
                    <div className="px-2 text-[11px] text-gray-500">
                      Filter by: {activeTab === "2" || activeTab === "3" ? "Closed Date" : "Submission Date"}
                    </div>
                  )}
                  getPopupContainer={(trigger) => trigger.parentElement || document.body}
                />
              </div>
            </div>
          </div>
        </div>
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(String(key))}
          items={[
            {
              key: "0",
              label: "Leads",
              children: (
                <Table
                  columns={columns}
                  dataSource={leadsTabData}
                  expandable={{
                    expandedRowRender,
                  }}
                  pagination={false}
                />
              ),
            },
            {
              key: "1",
              label: "Active Deals",
              children: (
                <Table
                  columns={activeColumns}
                  dataSource={activeDealsFiltered}
                  expandable={{
                    expandedRowRender,
                    defaultExpandedRowKeys: ["1"],
                  }}
                  pagination={false}
                />
              ),
            },
            {
              key: "2",
              label: "Won",
              children: (
                <Table
                  columns={wonColumns}
                  dataSource={completedData}
                  expandable={{
                    expandedRowRender,
                  }}
                  pagination={false}
                />
              ),
            },
            {
              key: "3",
              label: "Lost",
              children: (
                <Table
                  columns={lostColumns}
                  dataSource={lostData}
                  expandable={{
                    expandedRowRender,
                  }}
                  pagination={false}
                />
              ),
            },
          ]}
        />
      </main>
      <Footer />
    </div>
  )
}
