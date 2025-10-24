"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Select, Card, Row, Col } from "antd"
import { Bar, Line } from "react-chartjs-2"
import { useEffect, useRef, useState } from "react"
import { leadsData } from "@/lib/mock-data"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import type { Chart as ChartType } from "chart.js"
// no extra types needed from chart.js for the ref

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend)

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex flex-col">
      <div className="font-bold leading-none" style={{ fontSize: "2.5rem" }}>
        {value}
      </div>
      <div className="mt-1 text-sm text-gray-500">{label}</div>
    </div>
  )
}

export default function DashboardPage() {
  const lineChartRef = useRef<ChartType<"line"> | null>(null)
  const [legendVersion, setLegendVersion] = useState(0)

  // Ensure Chart.js uses the same font family as the app (Geist Sans via body)
  useEffect(() => {
    try {
      const bodyFont = getComputedStyle(document.body).fontFamily
      if (bodyFont) {
        ChartJS.defaults.font.family = bodyFont
      }
    } catch {
      // no-op for SSR
    }
  }, [])
  // Shared stage labels used for dataset legends
  const stageLabels = [
    "Contact Form Submitted",
    "Request for Services Submitted",
    "Soil Data Collection",
    "Agreement Sent",
    "Lost",
    "Analyst Team",
    "Report Complete Not Paid",
    "Won",
  ]

  // Fixed colors aligned with the stageLabels order for legend dots
  const legendColors = [
    "#3b82f6", // Contact Form Submitted (blue)
    "#8b5cf6", // Request for Services Submitted (purple)
    "#a16207", // Soil Data Collection (brown)
    "#f97316", // Agreement Sent (orange)
    "#ef4444", // Lost (red)
    "#6ee7b7", // Analyst Team (mint)
    "#10b981", // Report Complete Not Paid (green)
    "#06b6d4", // Won (cyan)
  ]

  const barChartData = {
    labels: [
      "Contact Form Submitted",
      "Request for Services Submitted",
      "Soil Data Collection",
      "Agreement Sent",
      "Lost",
      "Analyst Team",
      "Report Complete Not Paid",
      "Won",
    ],
    datasets: [
      {
        data: [1, 2, 2, 2, 2, 3, 3, 5],
        backgroundColor: ["#3b82f6", "#8b5cf6", "#a16207", "#06b6d4", "#ef4444", "#6ee7b7", "#10b981", "#047857"],
        borderRadius: 4,
      },
    ],
  }

  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: stageLabels[0],
        data: [0.5, 1.5, 1.5, 1, 1, 1, 3, 3, 3, 1, 2, 4],
        borderColor: "#3b82f6",
        backgroundColor: "transparent",
        tension: 0.4,
      },
      {
        label: stageLabels[1],
        data: [0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4],
        borderColor: "#8b5cf6",
        backgroundColor: "transparent",
        tension: 0.4,
      },
      {
        label: stageLabels[2],
        data: [1, 1.5, 1.5, 1, 1, 1, 1, 1, 1, 1, 1, 4],
        borderColor: "#a16207",
        backgroundColor: "transparent",
        tension: 0.4,
      },
      {
        label: stageLabels[3],
        data: [0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4],
        borderColor: "#f97316",
        backgroundColor: "transparent",
        tension: 0.4,
      },
      {
        label: stageLabels[4],
        data: [0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4],
        borderColor: "#ef4444",
        backgroundColor: "transparent",
        tension: 0.4,
      },
      {
        label: stageLabels[5],
        data: [0.5, 1, 1, 1, 1, 1, 1, 1, 1.5, 1.5, 1.5, 4],
        borderColor: "#6ee7b7",
        backgroundColor: "transparent",
        tension: 0.4,
      },
      {
        label: stageLabels[6],
        data: [0.5, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 4],
        borderColor: "#10b981",
        backgroundColor: "transparent",
        tension: 0.4,
      },
      {
        label: stageLabels[7],
        data: [0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1.5, 2, 4],
        borderColor: "#06b6d4",
        backgroundColor: "transparent",
        tension: 0.4,
      },
    ],
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    },
  }

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: { size: 11 },
        },
      },
      x: {
        ticks: {
          font: { size: 11 },
        },
      },
    },
  }

  // Top metrics: Referrals overview
  const referralsReceived = leadsData.length

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="flex-1 px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>

        <Row gutter={[12, 12]} className="mb-8">
          {/* New: Referrals card placed to the left of In Process Deals */}
          <Col xs={24} sm={12} lg={6}>
            <Card styles={{ body: { padding: 16 } }}>
              <Metric label="Referrals Received" value={referralsReceived} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card styles={{ body: { padding: 16 } }}>
              <div className="flex flex-col">
                <Metric label="In Process Deals" value={12} />
                <div className="my-2 h-px w-full bg-gray-200" />
                <Metric label="In Process Acres" value={5230} />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card styles={{ body: { padding: 16 } }}>
              <div className="flex flex-col">
                <Metric label="Won Deals" value={2} />
                <div className="my-2 h-px w-full bg-gray-200" />
                <Metric label="Won Acres" value={871} />
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card styles={{ body: { padding: 16 } }}>
              <div className="flex flex-col">
                <Metric label="Lost Deals" value={leadsData.filter((l) => l.stage === "Lost").length} />
                <div className="my-2 h-px w-full bg-gray-200" />
                <Metric
                  label="Lost Acres"
                  value={leadsData
                    .filter((l) => l.stage === "Lost")
                    .reduce((sum, l) => sum + (Number.parseInt(l.acres.replace(/[^0-9]/g, "")) || 0), 0)}
                />
              </div>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card
              title="Current Stage Status"
              extra={
                <Select defaultValue="Referrals" style={{ width: 120 }}>
                  <Select.Option value="Referrals">Referrals</Select.Option>
                  <Select.Option value="Acres">Acres</Select.Option>
                </Select>
              }
            >
              <div style={{ height: 350 }}>
                <Bar data={barChartData} options={barOptions} />
              </div>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card
              title="Monthly Stage Status"
              extra={
                <Select defaultValue="Referrals" style={{ width: 120 }}>
                  <Select.Option value="Referrals">Referrals</Select.Option>
                  <Select.Option value="Acres">Acres</Select.Option>
                </Select>
              }
            >
              <div className="relative z-0" style={{ height: 350 }}>
                <Line ref={lineChartRef} data={lineChartData} options={lineOptions} />
              </div>
              {/* Custom legend: 2 rows x 4 columns, ordered as requested */}
              <div className="relative z-10 mt-4 grid grid-cols-1 gap-y-2 gap-x-6 sm:[grid-template-columns:repeat(4,minmax(12rem,1fr))]">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                  const color = legendColors[i] || "#9ca3af"
                  const chart = lineChartRef.current
                  const isVisible = chart ? chart.isDatasetVisible(i) : true
                  return (
                    <button
                      key={i}
                      type="button"
                      className="flex items-center gap-2 text-left"
                      onClick={() => {
                        const c = lineChartRef.current
                        if (c) {
                          const vis = c.isDatasetVisible(i)
                          c.setDatasetVisibility(i, !vis)
                          c.update()
                          setLegendVersion((v) => v + 1)
                        }
                      }}
                    >
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{
                          backgroundColor: isVisible ? color : "transparent",
                          border: isVisible ? "2px solid transparent" : `2px solid ${color}`,
                        }}
                      />
                      <span className={(isVisible ? "text-gray-900" : "text-gray-400") + " whitespace-nowrap text-[11px]"}>
                        {stageLabels[i]}
                      </span>
                    </button>
                  )
                })}
              </div>
            </Card>
          </Col>
        </Row>
      </main>
      <Footer />
    </div>
  )
}
