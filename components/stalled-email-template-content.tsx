"use client"

import { useState, useMemo } from "react"
import { useUser } from "@/components/user-context"
import { MOCK_USERS } from "@/lib/mock-users"
import { Card, Typography, Input, Button, Form, message, Divider, Space } from "antd"
import { CopyOutlined, MailOutlined } from "@ant-design/icons"

const { Text } = Typography

function buildEmailBody(
  clientName: string,
  clientLandInfo: string,
  rpmName: string,
  referralUrl: string
): string {
  const client = clientName || "[CLIENT NAME]"
  const land = clientLandInfo || "[CLIENT NAME, INFO ABOUT LAND]"
  const rpm = rpmName || "[RPM NAME]"
  const url = referralUrl || "[YOUR REFERRAL URL LINK]"

  return `Hi ${client},

I wanted to reach out to see if you're still interested in the value that Boa Safra Ag provides. As a reminder they help landowners claim a one-time federal tax deduction based on the nutrient value already in their soil at the time of purchase or inheritance. Their clients average about $1,700 per acre in deductions.

I've connected with their team and would like to introduce you to ${rpm}, my dedicated contact at Boa Safra. They can walk you through how it works and what your land could qualify for.

I'm copying ${rpm} here so you two can connect directly.

Meet ${land}.

If you have questions, feel free to reach out to either of us.

When the time is right and you want to move forward, be sure to use my link below.

${url}`
}

export function StalledEmailTemplateContent() {
  const { user } = useUser()

  const manager = MOCK_USERS.find((u) => u.role === "manager")
  const rpmName = manager?.name ?? "your Boa Safra contact"
  const referralUrl = user?.referralCode
    ? `https://soiltest.com/ref/${user.referralCode.toLowerCase()}`
    : "[YOUR REFERRAL URL LINK]"

  const [clientName, setClientName] = useState("")
  const [clientLandInfo, setClientLandInfo] = useState("")
  const [messageApi, contextHolder] = message.useMessage()

  const emailBody = useMemo(
    () => buildEmailBody(clientName, clientLandInfo, rpmName, referralUrl),
    [clientName, clientLandInfo, rpmName, referralUrl]
  )

  const handleCopy = () => {
    navigator.clipboard.writeText(emailBody).then(() => {
      messageApi.success("Email copied to clipboard")
    })
  }

  return (
    <>
      {contextHolder}
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">
          Use this template to re-engage stalled clients. Fill in the details below and copy the message to send.
        </Text>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
        <Card title={<Text strong>Customize Your Message</Text>} variant="bordered">
          <Form layout="vertical" style={{ gap: 0 }}>
            <Form.Item
              label={<Text strong>Client Name</Text>}
              style={{ marginBottom: 20 }}
              extra="The name of the stalled client you're reaching out to."
            >
              <Input
                placeholder="e.g. Roger Bohenkamp"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                size="large"
              />
            </Form.Item>

            <Form.Item
              label={<Text strong>Client Land Info</Text>}
              style={{ marginBottom: 20 }}
              extra='Brief description used in the introduction line, e.g. "Roger Bohenkamp, 1,020 acres in Iowa"'
            >
              <Input
                placeholder='e.g. Roger Bohenkamp, 1,020 acres in Iowa'
                value={clientLandInfo}
                onChange={(e) => setClientLandInfo(e.target.value)}
                size="large"
              />
            </Form.Item>

            <Divider style={{ margin: "4px 0 16px" }} />

            <Form.Item label={<Text strong>Your Boa Safra Contact (RPM)</Text>} style={{ marginBottom: 20 }}>
              <Input value={rpmName} disabled size="large" />
            </Form.Item>

            <Form.Item label={<Text strong>Your Referral Link</Text>} style={{ marginBottom: 0 }}>
              <Input value={referralUrl} disabled size="large" />
            </Form.Item>
          </Form>
        </Card>

        <Card
          title={
            <Space>
              <MailOutlined style={{ color: "#4a9d6f" }} />
              <Text strong>Email Preview</Text>
            </Space>
          }
          variant="bordered"
          extra={
            <Button icon={<CopyOutlined />} type="primary" onClick={handleCopy}>
              Copy Email
            </Button>
          }
        >
          <div
            style={{
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: "20px 24px",
              whiteSpace: "pre-wrap",
              fontFamily: "inherit",
              fontSize: 14,
              lineHeight: 1.7,
              color: "#374151",
              minHeight: 420,
            }}
          >
            {emailBody}
          </div>
        </Card>
      </div>
    </>
  )
}
