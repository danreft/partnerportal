"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Select, Card, Row, Col, Statistic } from "antd"
import { Bar, Line } from "react-chartjs-2"
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
import type { Chart as ChartInstance, LegendItem } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend)

export default function DashboardPage() {
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
        display: true,
        position: "bottom" as const,
        // Clicking legend items in Chart.js toggles the corresponding dataset visibility.
        // We enable the default plugin here and provide nicer, compact labels.
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8,
          // Remove the default line-through on hidden datasets; instead, dim the color dot.
          generateLabels: (chart: ChartInstance): LegendItem[] => {
            const datasets = chart.data.datasets || []
            return datasets.map((ds: any, i: number): LegendItem => {
              const visible = chart.isDatasetVisible(i)
              // Resolve a base color from dataset border/background
              const baseColor =
                (typeof ds.borderColor === "string" && ds.borderColor) ||
                (Array.isArray(ds.borderColor) && ds.borderColor[0]) ||
                (typeof ds.backgroundColor === "string" && ds.backgroundColor) ||
                (Array.isArray(ds.backgroundColor) && ds.backgroundColor[0]) ||
                "#9ca3af" // gray-400 fallback

              const swatchColor = visible ? baseColor : "#e5e7eb" // gray-200 when hidden

              const item: LegendItem = {
                text: ds.label || `Series ${i + 1}`,
                fillStyle: swatchColor,
                strokeStyle: swatchColor,
                // Keep this false so Chart.js doesn't draw a strikethrough on the label text.
                hidden: false,
                lineCap: "butt",
                lineDash: [],
                lineDashOffset: 0,
                lineJoin: "miter",
                lineWidth: 2,
                datasetIndex: i,
                pointStyle: "circle",
              }
              return item
            })
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="flex-1 px-6 py-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          </div>

          <Select defaultValue="This year" style={{ width: 120 }}>
            <Select.Option value="This year">This year</Select.Option>
            <Select.Option value="Last year">Last year</Select.Option>
          </Select>
        </div>

        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic title="Total Referrals" value={12} valueStyle={{ fontSize: "2.5rem", fontWeight: "bold" }} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Acres Referred"
                value={5230}
                valueStyle={{ fontSize: "2.5rem", fontWeight: "bold" }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic title="Completed Deals" value={2} valueStyle={{ fontSize: "2.5rem", fontWeight: "bold" }} />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic title="Completed Acres" value={871} valueStyle={{ fontSize: "2.5rem", fontWeight: "bold" }} />
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
              <div style={{ height: 350 }}>
                <Line data={lineChartData} options={lineOptions} />
              </div>
            </Card>
          </Col>
        </Row>
      </main>
      <Footer />
    </div>
  )
}
