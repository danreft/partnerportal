"use client"

import { DatePicker, Input, Select, Table, Tabs, Button, Alert } from "antd"
import { UserOutlined, MailOutlined, PhoneOutlined, MailFilled } from "@ant-design/icons"
import Link from "next/link"
import type { ColumnsType } from "antd/es/table"
import { leadsData, isLeadStalled, daysInCurrentStage, type LeadData } from "@/lib/mock-data"
import { MOCK_USERS } from "@/lib/mock-users"
import type { ColumnType } from "antd/es/table"
import dayjs, { type Dayjs } from "dayjs"
import { useState, useMemo, useCallback, useEffect } from "react"
import { useSearchParams } from "next/navigation"

const CRM_ALLOWED_STAGES = [
  "Inbound Calls",
  "Inbound Contact Forms",
  "Invitation Email",
  "RFS Qualified Paused",
] as const
const REQUIRED_PIPELINE = "Soil Nutrient Load Pipeline"

const ACTIVE_ALLOWED_STAGES = new Set<string>([
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

const partnerByCode: Record<string, string> = Object.fromEntries(
  MOCK_USERS.filter((u) => u.referralCode).map((u) => [u.referralCode!, u.name])
)

interface ReferralsViewProps {
  filterReferralCode?: string
}

export function ReferralsView({ filterReferralCode }: ReferralsViewProps) {
  const expandedRowRenderActiveDeals = (record: LeadData) => {
    const hasProgress = Boolean(record.progress)
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
    if (record.stage === "Lost" || !hasProgress) {
      return <div className="px-6 py-3">{contactSection}</div>
    }
    const businessStages = [
      "RFS Submitted",
      "Agreement Sent",
      "Soil Data Collection",
      "Analyst Team",
      "Report Complete | Not Paid",
      "Won",
    ]
    const progressStages = businessStages.map((stageName) => {
      let matches: any[] = []
      switch (stageName) {
        case "RFS Submitted":
          matches = record.progress?.stages.filter(s => ["Request for Services Submitted", "Contact Form Submitted", "RFS Submitted"].includes(s.name)) || []
          break
        case "Agreement Sent":
          matches = record.progress?.stages.filter(s => ["Agreement Sent", "Service Contract Under Review", "Docusign"].includes(s.name)) || []
          break
        case "Soil Data Collection":
          matches = record.progress?.stages.filter(s => ["Soil Data Collection", "Soil Team", "Soils Complete/Analyst Queue"].includes(s.name)) || []
          break
        case "Analyst Team":
          matches = record.progress?.stages.filter(s => ["Analyst Team"].includes(s.name)) || []
          break
        case "Report Complete | Not Paid":
          matches = record.progress?.stages.filter(s => ["Report Complete/Not Paid", "Report Review NOT PAID"].includes(s.name)) || []
          break
        case "Won":
          matches = record.progress?.stages.filter(s => ["Won"].includes(s.name)) || []
          break
        default:
          matches = []
      }
      return {
        name: stageName,
        completed: matches.some(s => s.completed),
        current: matches.some(s => s.current),
        date: matches.find(s => s.date)?.date,
      }
    })
    const totalStages = progressStages.length
    const currentIdx = progressStages.findIndex(s => s.current)
    return (
      <div className="px-6 py-3">
        {contactSection}
        <div className="relative">
          <div className="mb-2 flex h-2 w-full overflow-hidden rounded-full">
            {progressStages.map((stage, i) => {
              let barColor
              if (currentIdx === -1) {
                barColor = stage.completed ? "bg-green-600" : "bg-gray-200"
              } else if (i < currentIdx) {
                barColor = "bg-green-600"
              } else if (i === currentIdx) {
                barColor = "bg-gray-400"
              } else {
                barColor = "bg-gray-200"
              }
              return (
                <div
                  key={i}
                  className={`${barColor} flex-1`}
                  style={{ marginRight: i < totalStages - 1 ? 2 : 0 }}
                />
              )
            })}
          </div>
          <div className="flex justify-between">
            {progressStages.map((stage, index) => {
              let indicator
              if (currentIdx === -1) {
                indicator = stage.completed ? (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">✓</div>
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-gray-300 bg-white" />
                )
              } else if (index < currentIdx) {
                indicator = (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">✓</div>
                )
              } else if (index === currentIdx) {
                indicator = (
                  <div className="h-5 w-5 rounded-full border-4 border-green-600 bg-white" />
                )
              } else {
                indicator = (
                  <div className="h-5 w-5 rounded-full border-2 border-gray-300 bg-white" />
                )
              }
              return (
                <div
                  key={index}
                  className="flex flex-col items-center"
                  style={{ width: `${100 / totalStages}%` }}
                >
                  <div className="mb-2">{indicator}</div>
                  <div className="text-center text-xs font-medium text-gray-700">{stage.name}</div>
                  {stage.date && <div className="text-xs text-gray-500">{stage.date}</div>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const searchParams = useSearchParams()
  const tabParam = searchParams.get("tab")
  const tabParamToKey: Record<string, string> = { stalled: "2", won: "3", lost: "4", "active-deals": "1" }
  const initialTab = tabParam ? (tabParamToKey[tabParam] ?? "0") : "0"

  const [searchText, setSearchText] = useState("")
  const [submissionRange, setSubmissionRange] = useState<[Dayjs | null, Dayjs | null] | null>(null)
  const [activeTab, setActiveTab] = useState(initialTab)
  const [selectedPartners, setSelectedPartners] = useState<string[]>([])

  useEffect(() => {
    if (tabParam) setActiveTab(tabParamToKey[tabParam] ?? "0")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabParam])

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

  const partnerOptions = useMemo(
    () => MOCK_USERS.filter((u) => u.role === "partner").map((u) => ({ label: u.name, value: u.referralCode! })),
    []
  )

  const searchFiltered = useMemo(() => {
    const query = searchText.trim().toLowerCase()
    return leadsData.filter((lead) => {
      if (selectedPartners.length > 0 && !selectedPartners.includes(lead.referralCode ?? "")) return false
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
  }, [searchText, selectedPartners])

  const isWithinRange = useCallback(
    (dateStr?: string | null) => {
      if (!submissionRange || (!submissionRange[0] && !submissionRange[1])) return true
      if (!dateStr) return false
      const time = new Date(dateStr).getTime()
      const start = submissionRange[0]?.startOf("day").valueOf()
      const end = submissionRange[1]?.endOf("day").valueOf()
      if (start != null && end != null) return time >= start && time <= end
      if (start != null) return time >= start
      if (end != null) return time <= end
      return true
    },
    [submissionRange]
  )

  const activeData = useMemo(
    () =>
      searchFiltered.filter(
        (l) => l.stage !== "Lost" && l.stage !== "Won" && isWithinRange(l.submissionDate)
      ),
    [searchFiltered, isWithinRange]
  )
  const lostData = useMemo(
    () => searchFiltered.filter((l) => l.stage === "Lost" && isWithinRange(l.closedDate)),
    [searchFiltered, isWithinRange]
  )
  const completedData = useMemo(
    () => searchFiltered.filter((l) => l.stage === "Won" && isWithinRange(l.closedDate)),
    [searchFiltered, isWithinRange]
  )
  const stalledData = useMemo(
    () => searchFiltered.filter((l) => isLeadStalled(l) && isWithinRange(l.submissionDate)),
    [searchFiltered, isWithinRange]
  )

  const isOpen = (lead: LeadData) => {
    if (lead.dealStatus) return lead.dealStatus === "Open"
    return lead.stage !== "Won" && lead.stage !== "Lost"
  }

  const deriveStage = (lead: LeadData) => {
    const stages = lead.progress?.stages ?? []
    const current = stages.find((s) => s.current)
    const completed = stages.filter((s) => s.completed)
    const lastCompleted = completed.length ? completed[completed.length - 1] : undefined
    return (current?.name || lastCompleted?.name || lead.stage || "").trim()
  }

  const activeDealsFiltered = useMemo(
    () =>
      activeData.filter((lead) => {
        if (!isOpen(lead)) return false
        const stageName = deriveStage(lead)
        return ACTIVE_ALLOWED_STAGES.has(stageName)
      }),
    [activeData]
  )

  const leadsTabData = useMemo(() => {
    return searchFiltered.filter((lead) => {
      if (filterReferralCode && lead.referralCode !== filterReferralCode) return false
      return (
        lead.pipeline === REQUIRED_PIPELINE &&
        !!lead.crmStage &&
        CRM_ALLOWED_STAGES.includes(lead.crmStage as any) &&
        isOpen(lead) &&
        isWithinRange(lead.submissionDate)
      )
    })
  }, [searchFiltered, isWithinRange, filterReferralCode])

  const expandedRowRender = (record: LeadData) => {
    const hasProgress = Boolean(record.progress)
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

    if (record.stage === "Lost") {
      return (
        <div className="space-y-4 px-6 py-3">
          {contactSection}
          <div className="rounded-lg border border-red-100 bg-red-50/80 p-4">
            <div className="text-xs font-semibold uppercase tracking-wide text-red-600">
              Lost Details
            </div>
            <div className="mt-2 space-y-3 text-sm text-gray-800">
              <div>
                <span className="font-medium text-gray-900">Reason:</span>{" "}
                {record.lostReason || "Other"}
              </div>
              {record.lostComment ? (
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Comments
                  </div>
                  <div className="mt-1 whitespace-pre-line text-gray-700">
                    {record.lostComment}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )
    }

    if (!hasProgress) {
      return <div className="px-6 py-3">{contactSection}</div>
    }

    const isLeadsTab =
      record.pipeline === REQUIRED_PIPELINE &&
      CRM_ALLOWED_STAGES.includes(record.crmStage as any)

    if (isLeadsTab) {
      const stagesRaw = record.progress!.stages
      const invitationCurrent =
        stagesRaw.some(s => s.name === "Invitation Sent" && s.current) ||
        record.stage === "Invitation Sent" ||
        record.crmStage === "Invitation Sent"
      const customStages = [
        {
          name: "Contact Information",
          completed: stagesRaw.some(s => s.name === "Contact Form Submitted" && s.completed),
          current: stagesRaw.some(s => s.name === "Contact Form Submitted" && s.current),
          date: stagesRaw.find(s => s.name === "Contact Form Submitted")?.date,
        },
        {
          name: "Invitation Sent",
          completed: stagesRaw.some(s => s.name === "Invitation Sent" && s.completed),
          current: invitationCurrent,
          date: stagesRaw.find(s => s.name === "Invitation Sent")?.date,
        },
      ]
      const totalStages = customStages.length
      return (
        <div className="px-6 py-3">
          {contactSection}
          <div className="relative">
            <div className="mb-2 flex h-2 w-full overflow-hidden rounded-full">
              {customStages.map((stage, i) => (
                <div
                  key={i}
                  className={
                    stage.completed
                      ? "bg-green-600 flex-1"
                      : stage.current
                        ? "bg-gray-400 flex-1"
                        : "bg-gray-200 flex-1"
                  }
                  style={{ marginRight: i < totalStages - 1 ? 2 : 0 }}
                />
              ))}
            </div>
            <div className="flex justify-between">
              {customStages.map((stage, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center"
                  style={{ width: `${100 / totalStages}%` }}
                >
                  <div className="mb-2">
                    {stage.completed ? (
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">✓</div>
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

    const businessStages = [
      "RFS Submitted",
      "Docusign",
      "Soil Team",
      "Soils Complete/Analyst Queue",
      "Analyst Team",
      "Report Complete",
      "Report Review | Not Paid",
      "Won",
    ]
    const progressStages = businessStages.map((stageName) => {
      let matches: any[] = []
      switch (stageName) {
        case "RFS Submitted":
          matches = record.progress?.stages.filter(s => ["Request for Services Submitted", "Contact Form Submitted", "RFS Submitted"].includes(s.name)) || []
          break
        case "Docusign":
          matches = record.progress?.stages.filter(s => ["Agreement Sent", "Service Contract Under Review", "Docusign"].includes(s.name)) || []
          break
        case "Soil Team":
          matches = record.progress?.stages.filter(s => ["Soil Data Collection", "Soil Team"].includes(s.name)) || []
          break
        case "Soils Complete/Analyst Queue":
          matches = record.progress?.stages.filter(s => ["Soils Complete/Analyst Queue"].includes(s.name)) || []
          break
        case "Analyst Team":
          matches = record.progress?.stages.filter(s => ["Analyst Team"].includes(s.name)) || []
          break
        case "Report Complete":
          matches = record.progress?.stages.filter(s => ["Report Complete"].includes(s.name)) || []
          break
        case "Report Review | Not Paid":
          matches = record.progress?.stages.filter(s => ["Report Complete/Not Paid", "Report Review NOT PAID"].includes(s.name)) || []
          break
        case "Won":
          matches = record.progress?.stages.filter(s => ["Won"].includes(s.name)) || []
          break
        default:
          matches = []
      }
      return {
        name: stageName,
        completed: matches.some(s => s.completed),
        current: matches.some(s => s.current),
        date: matches.find(s => s.date)?.date,
      }
    })
    const totalStages = progressStages.length
    return (
      <div className="px-6 py-3">
        {contactSection}
        <div className="relative">
          <div className="mb-2 flex h-2 w-full overflow-hidden rounded-full">
            {progressStages.map((stage, i) => (
              <div
                key={i}
                className={
                  stage.completed
                    ? "bg-green-600 flex-1"
                    : stage.current
                      ? "bg-gray-400 flex-1"
                      : "bg-gray-200 flex-1"
                }
                style={{ marginRight: i < totalStages - 1 ? 2 : 0 }}
              />
            ))}
          </div>
          <div className="flex justify-between">
            {progressStages.map((stage, index) => (
              <div
                key={index}
                className="flex flex-col items-center"
                style={{ width: `${100 / totalStages}%` }}
              >
                <div className="mb-2">
                  {stage.completed ? (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">✓</div>
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

  const showPartner = !filterReferralCode

  const stageColorClass = (record: LeadData) =>
    record.stageColor === "blue" ? "bg-blue-500"
    : record.stageColor === "purple" ? "bg-purple-600"
    : record.stageColor === "orange" ? "bg-amber-600"
    : record.stageColor === "red" ? "bg-red-500"
    : record.stageColor === "green" ? "bg-green-600"
    : "bg-gray-400"

  const mapToBusinessStage = (name: string) => {
    switch (name) {
      case "Request for Services Submitted":
      case "Contact Form Submitted":
      case "RFS Submitted":
        return "RFS Submitted"
      case "Agreement Sent":
      case "Service Contract Under Review":
      case "Docusign":
        return "Agreement Sent"
      case "Soil Data Collection":
      case "Soil Team":
      case "Soils Complete/Analyst Queue":
        return "Soil Data Collection"
      case "Analyst Team":
        return "Analyst Team"
      case "Report Complete/Not Paid":
      case "Report Review NOT PAID":
        return "Report Complete | Not Paid"
      case "Won":
        return "Won"
      default:
        return name
    }
  }

  const colLeadName: ColumnType<LeadData> = {
    title: "Lead Name",
    dataIndex: "leadName",
    key: "leadName",
    sorter: (a, b) => a.leadName.localeCompare(b.leadName),
  }

  const colPartner: ColumnType<LeadData> = {
    title: "Partner",
    key: "partner",
    render: (_: any, record: LeadData) =>
      partnerByCode[record.referralCode ?? ""] ?? record.referralCode ?? "-",
    sorter: (a, b) =>
      (partnerByCode[a.referralCode ?? ""] ?? "").localeCompare(
        partnerByCode[b.referralCode ?? ""] ?? ""
      ),
  }

  const colAcres: ColumnType<LeadData> = {
    title: "Acres",
    dataIndex: "acres",
    key: "acres",
    sorter: (a, b) =>
      Number.parseInt(a.acres.replace(/[^0-9]/g, "")) -
      Number.parseInt(b.acres.replace(/[^0-9]/g, "")),
  }

  const colSubmissionDate: ColumnType<LeadData> = {
    title: "Submission Date",
    dataIndex: "submissionDate",
    key: "submissionDate",
    render: (date: string) => <span className="text-gray-800">{formatMMDDYYYY(date)}</span>,
    sorter: (a, b) => new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime(),
  }

  const colStage: ColumnType<LeadData> = {
    title: "Stage",
    dataIndex: "stage",
    key: "stage",
    render: (stage: string, record: LeadData) => {
      const label = stage === "Lost" && record.lostReason ? `Lost - ${record.lostReason}` : stage
      return (
        <div className="flex items-center gap-2">
          <span className={`inline-block h-2.5 w-2.5 rounded-full ${stageColorClass(record)}`} />
          <span className="text-gray-800">{label}</span>
        </div>
      )
    },
    sorter: (a, b) => a.stage.localeCompare(b.stage),
  }

  const partnerCols: ColumnType<LeadData>[] = showPartner ? [colPartner] : []

  const columns: ColumnsType<LeadData> = [colLeadName, ...partnerCols, colAcres, colSubmissionDate, colStage]

  const activeColumns: ColumnsType<LeadData> = [
    colLeadName,
    ...partnerCols,
    colAcres,
    colSubmissionDate,
    {
      ...colStage,
      render: (_stage: string, record: LeadData) => {
        const derived = deriveStage(record)
        const label = mapToBusinessStage(derived)
        return (
          <div className="flex items-center gap-2">
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${stageColorClass(record)}`} />
            <span className="text-gray-800">{label}</span>
          </div>
        )
      },
    },
  ]

  const lostColumns: ColumnsType<LeadData> = [
    ...columns,
    {
      title: "Lost Date",
      key: "closedDate",
      dataIndex: "closedDate",
      render: (_: any, record: LeadData) => (
        <span className="text-gray-800">{formatMMDDYYYY(record.closedDate)}</span>
      ),
      sorter: (a, b) => new Date(a.closedDate || 0).getTime() - new Date(b.closedDate || 0).getTime(),
    },
  ]

  const wonColumns: ColumnsType<LeadData> = [
    ...columns,
    {
      title: "Won Date",
      key: "closedDate",
      dataIndex: "closedDate",
      render: (_: any, record: LeadData) => (
        <span className="text-gray-800">{formatMMDDYYYY(record.closedDate)}</span>
      ),
      sorter: (a, b) => new Date(a.closedDate || 0).getTime() - new Date(b.closedDate || 0).getTime(),
    },
  ]

  const stalledColumns: ColumnsType<LeadData> = [
    ...columns,
    {
      title: "Days Stalled",
      key: "daysStalled",
      render: (_: any, record: LeadData) => {
        const days = daysInCurrentStage(record)
        return <span style={{ color: "#d97706", fontWeight: 500 }}>{days} days</span>
      },
      sorter: (a, b) => daysInCurrentStage(a) - daysInCurrentStage(b),
      defaultSortOrder: "descend" as const,
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <main style={{ width: "100%", maxWidth: 1200, margin: "0 auto", flex: 1, padding: 32 }}>
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
              {showPartner && (
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
              <div className="flex flex-col gap-1">
                <div className="text-[11px] text-gray-500 whitespace-nowrap">
                  Filter by: {activeTab === "3" || activeTab === "4" ? "Closed Date" : "Submission Date"}
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
                      Filter by: {activeTab === "3" || activeTab === "4" ? "Closed Date" : "Submission Date"}
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
                  expandable={{ expandedRowRender }}
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
                    expandedRowRender: expandedRowRenderActiveDeals,
                    defaultExpandedRowKeys: ["1"],
                  }}
                  pagination={false}
                />
              ),
            },
            {
              key: "2",
              label: "Stalled",
              children: (
                <div>
                  <Alert
                    style={{ marginBottom: 16 }}
                    type="warning"
                    showIcon
                    message="Reach out to your clients to remind them about the value that Boa Safra Ag can provide them."
                    action={
                      <Link href="/resources?tab=stalled-email">
                        <Button icon={<MailFilled />} type="primary">
                          Stalled Deal Email Template
                        </Button>
                      </Link>
                    }
                  />
                  <Table
                    columns={stalledColumns}
                    dataSource={stalledData}
                    expandable={{ expandedRowRender: expandedRowRenderActiveDeals }}
                    pagination={false}
                    rowKey="key"
                  />
                </div>
              ),
            },
            {
              key: "3",
              label: "Won",
              children: (
                <Table
                  columns={wonColumns}
                  dataSource={completedData}
                  expandable={{ expandedRowRender }}
                  pagination={false}
                />
              ),
            },
            {
              key: "4",
              label: "Lost",
              children: (
                <Table
                  columns={lostColumns}
                  dataSource={lostData}
                  expandable={{ expandedRowRender }}
                  pagination={false}
                />
              ),
            },
          ]}
        />
      </main>
    </div>
  )
}
