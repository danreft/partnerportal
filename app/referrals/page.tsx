"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Input, Select, Table, Tabs } from "antd"
import { UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import { leadsData, type LeadData } from "@/lib/mock-data"
import { useState, useMemo } from "react"

export default function ReferralsPage() {
  const [searchText, setSearchText] = useState("")
  const [yearFilter, setYearFilter] = useState("This year")
  const [stageFilter, setStageFilter] = useState("All")

  const filteredData = useMemo(() => {
    return leadsData.filter((lead) => {
      const matchesSearch =
        searchText === "" ||
        lead.leadName.toLowerCase().includes(searchText.toLowerCase()) ||
        lead.contact.name.toLowerCase().includes(searchText.toLowerCase()) ||
        lead.contact.email.toLowerCase().includes(searchText.toLowerCase())

      const leadYear = new Date(lead.submissionDate).getFullYear()
      const currentYear = new Date().getFullYear()
      const matchesYear =
        yearFilter === "This year"
          ? leadYear === currentYear
          : yearFilter === "Last year"
            ? leadYear === currentYear - 1
            : yearFilter === "All years"
              ? true
              : true

  const matchesStage = stageFilter === "All" || lead.stage === stageFilter

      return matchesSearch && matchesYear && matchesStage
    })
  }, [searchText, yearFilter, stageFilter])

  // Split filtered data into Active (non-Lost) and Lost buckets
  const activeData = useMemo(
    () => filteredData.filter((l) => l.stage !== "Lost" && l.stage !== "Won"),
    [filteredData]
  )
  const lostData = useMemo(() => filteredData.filter((l) => l.stage === "Lost"), [filteredData])
  const completedData = useMemo(() => filteredData.filter((l) => l.stage === "Won"), [filteredData])

  // CSV export removed per request

  const uniqueStages = useMemo(() => {
    const stages = Array.from(new Set(leadsData.map((lead) => lead.stage)))
    return stages.sort()
  }, [])

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

  // Lost-only columns: add Closed Date to the right of Stage
  const lostColumns: ColumnsType<LeadData> = [
    ...columns,
    {
      title: "Closed Date",
      key: "closedDate",
      dataIndex: "closedDate",
      render: (_: any, record: LeadData) => {
        return <span className="text-gray-800">{record.closedDate || "-"}</span>
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
        return <span className="text-gray-800">{record.closedDate || "-"}</span>
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
          <div className="flex gap-3">
            <Input
              placeholder="Search Lead Name..."
              style={{ width: 200 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
            <Select
              value={yearFilter}
              style={{ width: 120 }}
              onChange={setYearFilter}
              getPopupContainer={(trigger) => trigger.parentElement || document.body}
            >
              <Select.Option value="This year">This year</Select.Option>
              <Select.Option value="Last year">Last year</Select.Option>
              <Select.Option value="All years">All years</Select.Option>
            </Select>
            <Select
              value={stageFilter}
              style={{ width: 180 }}
              onChange={setStageFilter}
              getPopupContainer={(trigger) => trigger.parentElement || document.body}
            >
              <Select.Option value="All">All Stages</Select.Option>
              {uniqueStages.map((stage) => (
                <Select.Option key={stage} value={stage}>
                  {stage}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>

        <Tabs
          defaultActiveKey="0"
          items={[
            {
              key: "0",
              label: "Leads",
              children: (
                <Table
                  columns={columns}
                  dataSource={filteredData}
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
                  columns={columns}
                  dataSource={activeData}
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
