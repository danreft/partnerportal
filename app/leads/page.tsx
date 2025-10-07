"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Input, Select, Button, Table, Tag, Tabs, Progress } from "antd"
import type { ColumnsType } from "antd/es/table"
import { leadsData, type LeadData } from "@/lib/mock-data"
import { useState, useMemo } from "react"

export default function LeadsPage() {
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

      const matchesStage = stageFilter === "All" || stageFilter === "Stage Type" || lead.stage === stageFilter

      return matchesSearch && matchesYear && matchesStage
    })
  }, [searchText, yearFilter, stageFilter])

  const downloadCSV = () => {
    const headers = ["Lead Name", "Acres", "Submission Date", "Stage", "Contact Name", "Email", "Phone"]
    const csvData = filteredData.map((lead) => [
      lead.leadName,
      lead.acres,
      lead.submissionDate,
      lead.stage,
      lead.contact.name,
      lead.contact.email,
      lead.contact.phone,
    ])

    const csvContent = [headers.join(","), ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `leads_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const uniqueStages = useMemo(() => {
    const stages = Array.from(new Set(leadsData.map((lead) => lead.stage)))
    return stages.sort()
  }, [])

  const expandedRowRender = (record: LeadData) => {
    if (!record.progress) return null

    const completedStages = record.progress.stages.filter((s) => s.completed).length
    const totalStages = record.progress.stages.length
    const progressPercent = (completedStages / totalStages) * 100

    return (
      <div className="px-8 py-6">
        <div className="mb-6 grid grid-cols-3 gap-8">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">👤</span>
            <div>
              <div className="text-xs text-gray-500">Contact</div>
              <div className="font-medium">{record.contact.name}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">✉️</span>
            <div>
              <div className="text-xs text-gray-500">Email</div>
              <div className="font-medium">{record.contact.email}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">📞</span>
            <div>
              <div className="text-xs text-gray-500">Phone</div>
              <div className="font-medium">{record.contact.phone}</div>
            </div>
          </div>
        </div>

        <div className="relative">
          <Progress
            percent={progressPercent}
            showInfo={false}
            strokeColor="#10b981"
            trailColor="#e5e7eb"
            className="mb-4"
          />
          <div className="flex justify-between">
            {record.progress.stages.map((stage, index) => (
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
      render: (stage: string, record: LeadData) => <Tag color={record.stageColor}>{stage}</Tag>,
      sorter: (a, b) => a.stage.localeCompare(b.stage),
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="flex-1 px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Leads</h1>
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
            <Button onClick={downloadCSV}>Download CSV</Button>
          </div>
        </div>

        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: "1",
              label: "Active Deals",
              children: (
                <Table
                  columns={columns}
                  dataSource={filteredData}
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
              label: "Completed",
              children: <Table columns={columns} dataSource={[]} pagination={false} />,
            },
          ]}
        />
      </main>
      <Footer />
    </div>
  )
}
