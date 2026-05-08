"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  Button, Select, Tag, Card, Form, Input, DatePicker,
  TimePicker, Space, Divider, Typography, message, Modal,
  Layout, Menu, InputNumber, Row, Col, Avatar,
} from "antd"
import {
  UserOutlined, TeamOutlined, PlusOutlined, DeleteOutlined,
  SendOutlined, CalendarOutlined, SettingOutlined,
  EditOutlined, LoginOutlined,
} from "@ant-design/icons"
import { useUser } from "@/components/user-context"
import { MOCK_USERS } from "@/lib/mock-users"
import { announcementTagColor, type AnnouncementType } from "@/lib/mock-announcements"
import { Footer } from "@/components/layout/footer"
import dayjs from "dayjs"

const { TextArea } = Input
const { Text, Title } = Typography

// ─── Constants ──────────────────────────────────────────────────────────────

const roleLabel: Record<string, string> = {
  partner: "Referral Partner",
  manager: "Referral Team Manager",
}
const roleColor: Record<string, string> = {
  partner: "green",
  manager: "blue",
}
const announcementTypes: AnnouncementType[] = ["General", "Webinar", "Newsletter", "Deadline", "Update", "Reminder"]
type FieldType = "date" | "month" | "dateTime" | "timeRange"
interface TypeField { label: string; placeholder: string; fieldType?: FieldType }

const typeFields: Record<AnnouncementType, TypeField[]> = {
  General: [],
  Webinar: [
    { label: "Date", placeholder: "Select date", fieldType: "date" },
    { label: "Time", placeholder: "Select time range", fieldType: "timeRange" },
    { label: "Format", placeholder: "e.g. Live Zoom Webinar" },
    { label: "Host", placeholder: "e.g. Boa Safra Ag Agronomy Team" },
  ],
  Newsletter: [
    { label: "Issue", placeholder: "e.g. May 2026" },
    { label: "Published", placeholder: "Select month", fieldType: "month" },
  ],
  Deadline: [
    { label: "Deadline", placeholder: "Select date and time", fieldType: "dateTime" },
    { label: "Applies To", placeholder: "e.g. All referrals submitted April 1 – June 30" },
    { label: "Incentive Period", placeholder: "e.g. Q2 2026" },
  ],
  Update: [
    { label: "Effective Date", placeholder: "Select date", fieldType: "date" },
    { label: "Applies To", placeholder: "e.g. All new soil analysis reports" },
  ],
  Reminder: [
    { label: "Action Required By", placeholder: "Select date", fieldType: "date" },
    { label: "Who Is Affected", placeholder: "e.g. All active Referral Partners" },
  ],
}

interface LinkRow { label: string; url: string }

// ─── View As ────────────────────────────────────────────────────────────────

function ViewAsTab() {
  const { setUser } = useUser()
  const router = useRouter()
  const [selectedId, setSelectedId] = useState<string | undefined>()

  const handleSignIn = () => {
    const user = MOCK_USERS.find((u) => u.id === selectedId)
    if (!user) return
    setUser(user)
    router.push(user.role === "manager" ? "/manager" : "/")
  }

  const options = MOCK_USERS.map((u) => ({
    value: u.id,
    label: (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "2px 0" }}>
        <span style={{ fontWeight: 500, color: "#111827" }}>{u.name}</span>
        <Tag icon={u.role === "manager" ? <TeamOutlined /> : <UserOutlined />} color={roleColor[u.role]} style={{ margin: 0, flexShrink: 0 }}>
          {roleLabel[u.role]}
        </Tag>
      </div>
    ),
  }))

  return (
    <Row gutter={[24, 24]} justify="center">
      <Col xs={24} md={12} lg={8}>
        <Card variant="bordered" title={<Text strong>Sign In As</Text>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Select a user account to preview the portal from their perspective.
            </Text>
            <Select
              placeholder="Select a user..."
              options={options}
              value={selectedId}
              onChange={setSelectedId}
              size="large"
              style={{ width: "100%" }}
              optionLabelProp="label"
              popupMatchSelectWidth
            />
            <Button type="primary" size="large" block disabled={!selectedId} onClick={handleSignIn} icon={<LoginOutlined />}>
              Sign In
            </Button>
          </div>
        </Card>
      </Col>
    </Row>
  )
}

// ─── Draft Announcement ──────────────────────────────────────────────────────

function DraftAnnouncementTab() {
  const [form] = Form.useForm()
  const [selectedType, setSelectedType] = useState<AnnouncementType>("General")
  const [links, setLinks] = useState<LinkRow[]>([{ label: "", url: "" }])
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [scheduleDate, setScheduleDate] = useState<dayjs.Dayjs | null>(null)
  const [scheduleTime, setScheduleTime] = useState<dayjs.Dayjs | null>(null)

  const addLink = () => setLinks((prev) => [...prev, { label: "", url: "" }])
  const removeLink = (i: number) => setLinks((prev) => prev.filter((_, idx) => idx !== i))
  const updateLink = (i: number, field: keyof LinkRow, value: string) =>
    setLinks((prev) => prev.map((l, idx) => idx === i ? { ...l, [field]: value } : l))

  const resetForm = () => {
    form.resetFields()
    form.setFieldValue("type", "General")
    setSelectedType("General")
    setLinks([{ label: "", url: "" }])
  }

  const handleSend = () => {
    form.validateFields().then(() => {
      message.success("Announcement sent successfully.")
      resetForm()
    })
  }

  const handleSchedule = () => {
    form.validateFields().then(() => {
      if (!scheduleDate || !scheduleTime) { message.warning("Please select both a date and time."); return }
      const formatted = `${scheduleDate.format("MMMM D, YYYY")} at ${scheduleTime.format("h:mm A")}`
      message.success(`Announcement scheduled for ${formatted}.`)
      setScheduleOpen(false)
      resetForm()
      setScheduleDate(null)
      setScheduleTime(null)
    })
  }

  return (
    <Row gutter={[24, 24]} justify="center">
      <Col xs={24}>
        <Card variant="bordered" title={<Text strong>Draft Announcement</Text>}>
          <Form form={form} layout="vertical" requiredMark={false} initialValues={{ type: "General" }}>
            <Row gutter={16}>
              <Col xs={24} md={16}>
                <Form.Item label="Title" name="title" rules={[{ required: true, message: "Title is required" }]}>
                  <Input placeholder="e.g. Spring Soil Health Webinar" size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} md={8}>
                <Form.Item label="Type" name="type" rules={[{ required: true, message: "Type is required" }]}>
                  <Select
                    placeholder="Select type..."
                    size="large"
                    onChange={(v) => setSelectedType(v)}
                    options={announcementTypes.map((t) => ({
                      value: t,
                      label: <Tag color={announcementTagColor[t]} style={{ margin: 0 }}>{t}</Tag>,
                    }))}
                  />
                </Form.Item>
              </Col>
            </Row>

            {selectedType && typeFields[selectedType].length > 0 && (
              <>
                <Divider orientation="left" orientationMargin={0} style={{ fontSize: 12, color: "#9ca3af", marginTop: 0 }}>
                  {selectedType} Details
                </Divider>
                <Row gutter={16}>
                  {typeFields[selectedType].map((field) => (
                    <Col xs={24} md={12} key={field.label}>
                      <Form.Item label={field.label} name={field.label}>
                        {field.fieldType === "date" ? (
                          <DatePicker style={{ width: "100%" }} format="MMMM D, YYYY" />
                        ) : field.fieldType === "month" ? (
                          <DatePicker picker="month" style={{ width: "100%" }} format="MMMM YYYY" />
                        ) : field.fieldType === "dateTime" ? (
                          <DatePicker showTime use12Hours format="MMMM D, YYYY h:mm A" style={{ width: "100%" }} minuteStep={15} />
                        ) : field.fieldType === "timeRange" ? (
                          <TimePicker.RangePicker use12Hours format="h:mm A" minuteStep={15} style={{ width: "100%" }} />
                        ) : (
                          <Input placeholder={field.placeholder} />
                        )}
                      </Form.Item>
                    </Col>
                  ))}
                </Row>
              </>
            )}

            <Form.Item label="Body Copy" name="body" rules={[{ required: true, message: "Body copy is required" }]}>
              <TextArea
                placeholder="Write the full announcement content here. Use double line breaks to separate paragraphs."
                rows={8}
                style={{ resize: "vertical" }}
              />
            </Form.Item>

            <Form.Item label="Related Links">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {links.map((link, i) => (
                  <Space key={i} style={{ width: "100%" }} align="start">
                    <Input
                      placeholder="Label"
                      value={link.label}
                      onChange={(e) => updateLink(i, "label", e.target.value)}
                      style={{ width: 180 }}
                    />
                    <Input
                      placeholder="https://..."
                      value={link.url}
                      onChange={(e) => updateLink(i, "url", e.target.value)}
                      style={{ width: 300 }}
                    />
                    {links.length > 1 && (
                      <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeLink(i)} />
                    )}
                  </Space>
                ))}
                <Button type="dashed" icon={<PlusOutlined />} onClick={addLink} style={{ alignSelf: "flex-start", marginTop: 4 }}>
                  Add Link
                </Button>
              </div>
            </Form.Item>

            <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
              <Space>
                <Button type="primary" icon={<SendOutlined />} size="large" onClick={handleSend}>
                  Send Now
                </Button>
                <Button icon={<CalendarOutlined />} size="large" onClick={() => setScheduleOpen(true)}>
                  Schedule to Send Later
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Col>

      <Modal
        title="Schedule Announcement"
        open={scheduleOpen}
        onCancel={() => setScheduleOpen(false)}
        onOk={handleSchedule}
        okText="Schedule"
        width={360}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "16px 0" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, color: "#374151" }}>Send Date</div>
            <DatePicker value={scheduleDate} onChange={setScheduleDate} style={{ width: "100%" }} size="large" disabledDate={(d) => d.isBefore(dayjs().startOf("day"))} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, color: "#374151" }}>Send Time</div>
            <TimePicker value={scheduleTime} onChange={setScheduleTime} style={{ width: "100%" }} size="large" use12Hours format="h:mm A" minuteStep={15} />
          </div>
        </div>
      </Modal>
    </Row>
  )
}

// ─── Customize ───────────────────────────────────────────────────────────────

function CustomizeTab() {
  const [activityDays, setActivityDays] = useState<number>(30)
  const [stalledDays, setStalledDays] = useState<number>(30)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    message.success("Preferences saved for all users.")
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <Row gutter={[24, 24]} justify="center">
      <Col xs={24} lg={12}>
        <Card variant="bordered" title={<Text strong>Global Preferences</Text>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

            <div>
              <Text strong style={{ display: "block", marginBottom: 6 }}>Recent Activity Window</Text>
              <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 12 }}>
                How far back the Activity page looks when displaying recent events. Applies to all users.
              </Text>
              <Space align="center">
                <InputNumber
                  min={1}
                  max={365}
                  value={activityDays}
                  onChange={(v) => setActivityDays(v ?? 30)}
                  size="large"
                  style={{ width: 100 }}
                />
                <Text type="secondary">days</Text>
              </Space>
            </div>

            <Divider style={{ margin: 0 }} />

            <div>
              <Text strong style={{ display: "block", marginBottom: 6 }}>Stalled Threshold</Text>
              <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 12 }}>
                Number of days a lead or deal must be inactive in its current stage before it is marked as Stalled.
              </Text>
              <Space align="center">
                <InputNumber
                  min={1}
                  max={180}
                  value={stalledDays}
                  onChange={(v) => setStalledDays(v ?? 30)}
                  size="large"
                  style={{ width: 100 }}
                />
                <Text type="secondary">days of inactivity</Text>
              </Space>
            </div>

            <Divider style={{ margin: 0 }} />

            <div>
              <Button type="primary" size="large" icon={<SettingOutlined />} onClick={handleSave}>
                Save Preferences
              </Button>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  )
}

// ─── Admin Header ─────────────────────────────────────────────────────────────

function AdminHeader({ activeKey, onSelect }: { activeKey: string; onSelect: (k: string) => void }) {
  const menuItems = [
    { key: "view-as", label: <span onClick={() => onSelect("view-as")} style={{ display: "flex", alignItems: "center", gap: 6 }}><LoginOutlined /> View As</span> },
    { key: "draft-announcement", label: <span onClick={() => onSelect("draft-announcement")} style={{ display: "flex", alignItems: "center", gap: 6 }}><EditOutlined /> Draft Announcement</span> },
    { key: "customize", label: <span onClick={() => onSelect("customize")} style={{ display: "flex", alignItems: "center", gap: 6 }}><SettingOutlined /> Customize</span> },
  ]

  return (
    <Layout.Header style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: 0, minWidth: 320 }}>
      <div className="mx-auto flex h-16 items-center justify-between px-8" style={{ minWidth: 320, width: "100%" }}>
        <div className="flex items-center gap-6 min-w-0" style={{ flex: 1 }}>
          <Link href="/admin" className="flex items-center gap-2 min-w-max">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border-2 border-[#4a9d6f] p-1">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Kv0q55cARkvzD4tpBpzdOKq8ulAcue.png"
                alt="BoaSafra Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-semibold text-[#2d5f4a]">Referral Partner Portal</span>
          </Link>
          <div className="min-w-max">
            <Menu
              mode="horizontal"
              selectedKeys={[activeKey]}
              disabledOverflow
              style={{ background: "#fff", border: "none", fontWeight: 500, fontSize: 16, minWidth: 320 }}
              items={menuItems}
            />
          </div>
        </div>
        <Space size={8}>
          <Avatar size={32} style={{ backgroundColor: "#374151", fontSize: 13, fontWeight: 600 }}>A</Avatar>
          <span className="font-medium text-gray-700">Admin</span>
        </Space>
      </div>
    </Layout.Header>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

const tabTitles: Record<string, string> = {
  "view-as": "View As",
  "draft-announcement": "Draft Announcement",
  "customize": "Customize",
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("view-as")

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f9fafb" }}>
      <AdminHeader activeKey={activeTab} onSelect={setActiveTab} />
      <main style={{ width: "100%", maxWidth: 1200, margin: "0 auto", flex: 1, padding: 32 }}>
        <Title level={3} style={{ marginBottom: 24, fontWeight: 600, color: "#111" }}>
          {tabTitles[activeTab]}
        </Title>
        {activeTab === "view-as" && <ViewAsTab />}
        {activeTab === "draft-announcement" && <DraftAnnouncementTab />}
        {activeTab === "customize" && <CustomizeTab />}
      </main>
      <Footer />
    </div>
  )
}
