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

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend)

export default function DashboardPage() {
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
        data: [0.5, 1.5, 1.5, 1, 1, 1, 3, 3, 3, 1, 2, 4],
        borderColor: "#3b82f6",
        backgroundColor: "transparent",
        tension: 0.4,
      },
      {
        data: [0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4],
        borderColor: "#8b5cf6",
        backgroundColor: "transparent",
        tension: 0.4,
      },
      {
        data: [1, 1.5, 1.5, 1, 1, 1, 1, 1, 1, 1, 1, 4],
        borderColor: "#a16207",
        backgroundColor: "transparent",
        tension: 0.4,
      },
      {
        data: [0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4],
        borderColor: "#f97316",
        backgroundColor: "transparent",
        tension: 0.4,
      },
      {
        data: [0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4],
        borderColor: "#ef4444",
        backgroundColor: "transparent",
        tension: 0.4,
      },
      {
        data: [0.5, 1, 1, 1, 1, 1, 1, 1, 1.5, 1.5, 1.5, 4],
        borderColor: "#6ee7b7",
        backgroundColor: "transparent",
        tension: 0.4,
      },
      {
        data: [0.5, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 4],
        borderColor: "#10b981",
        backgroundColor: "transparent",
        tension: 0.4,
      },
      {
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
