"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import dynamic from "next/dynamic"
import {
  Button, Select, Tag, Card, Form, Input, DatePicker,
  TimePicker, Space, Divider, Typography, message, Modal,
  Layout, Menu, InputNumber, Row, Col, Avatar, Drawer, List,
  Upload, Radio, Tooltip,
} from "antd"
import type { UploadFile } from "antd/es/upload/interface"
import {
  UserOutlined, TeamOutlined, PlusOutlined, DeleteOutlined,
  SendOutlined, CalendarOutlined, SettingOutlined,
  EditOutlined, LoginOutlined, ClockCircleOutlined,
  EyeOutlined, PaperClipOutlined, LinkOutlined,
  WarningFilled,
} from "@ant-design/icons"
import { useUser } from "@/components/user-context"
import { MOCK_USERS } from "@/lib/mock-users"
import { announcementTagColor, type AnnouncementType } from "@/lib/mock-announcements"
import { Footer } from "@/components/layout/footer"
import dayjs from "dayjs"
import "react-quill-new/dist/quill.snow.css"

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })

const { TextArea } = Input
const { Text, Title } = Typography

// ─── Constants ──────────────────────────────────────────────────────────────

const roleLabel: Record<string, string> = {
  partner: "Referral Partner",
  manager: "Referral Team Lead",
}
const roleColor: Record<string, string> = {
  partner: "green",
  manager: "blue",
}
const announcementTypes: AnnouncementType[] = ["General", "Urgent", "Webinar", "Newsletter", "Deadline", "Update", "Reminder"]
type FieldType = "date" | "month" | "dateTime" | "timeRange"
interface TypeField { label: string; placeholder: string; fieldType?: FieldType }

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }, { background: [] }],
    ["link"],
    ["clean"],
  ],
}

const typeFields: Record<AnnouncementType, TypeField[]> = {
  General: [],
  Urgent: [
    { label: "Action Required", placeholder: "e.g. Submit updated contact info immediately" },
    { label: "Deadline", placeholder: "Select date and time", fieldType: "dateTime" },
  ],
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

interface ScheduledAnnouncement {
  id: number
  type: AnnouncementType
  title: string
  body: string
  scheduledFor: string // display string e.g. "June 2, 2026 at 9:00 AM"
  links: LinkRow[]
  typeFieldValues: Record<string, string>
}

const mockScheduled: ScheduledAnnouncement[] = [
  {
    id: 101,
    type: "Webinar",
    title: "Summer Soil Sampling Workshop",
    body: "Learn best practices for soil sampling during peak summer conditions. Our agronomists will walk through updated protocols and answer live questions.",
    scheduledFor: "June 3, 2026 at 10:00 AM",
    links: [{ label: "Register Now", url: "https://boasafraag.com/webinar" }],
    typeFieldValues: { Date: "June 3, 2026", Time: "10:00 AM – 11:30 AM", Format: "Live Zoom Webinar", Host: "Boa Safra Ag Agronomy Team" },
  },
  {
    id: 102,
    type: "Deadline",
    title: "Q2 Incentive Payout Cutoff",
    body: "All qualifying referrals for Q2 must have a completed service agreement on file by end of day June 30 to be eligible for the Q2 incentive payout.",
    scheduledFor: "June 10, 2026 at 8:00 AM",
    links: [{ label: "View Incentive Terms", url: "https://boasafraag.com/incentives" }],
    typeFieldValues: { Deadline: "June 30, 2026 at 11:59 PM", "Applies To": "All Q2 referral submissions", "Incentive Period": "Q2 2026" },
  },
  {
    id: 103,
    type: "Newsletter",
    title: "June Partner Newsletter",
    body: "This month's newsletter covers mid-year program performance highlights, an updated referral tier structure, and a recap of the Spring Soil Health Webinar.",
    scheduledFor: "June 1, 2026 at 7:00 AM",
    links: [
      { label: "View Full Newsletter (PDF)", url: "https://boasafraag.com/newsletter" },
      { label: "View Incentive Structure", url: "https://boasafraag.com/incentives" },
    ],
    typeFieldValues: { Issue: "June 2026", Published: "June 2026" },
  },
  {
    id: 104,
    type: "Reminder",
    title: "Mid-Year Profile Review Reminder",
    body: "Please take a moment to verify your contact details, service regions, and payment information are current before the July 1st audit.",
    scheduledFor: "June 15, 2026 at 9:00 AM",
    links: [{ label: "Update Your Profile", url: "https://boasafraag.com/profile" }],
    typeFieldValues: { "Action Required By": "July 1, 2026", "Who Is Affected": "All active Referral Partners" },
  },
  {
    id: 105,
    type: "General",
    title: "Portal Maintenance Window — June 8",
    body: "The partner portal will be offline for scheduled maintenance on June 8 from 12:00 AM to 4:00 AM CST. Please plan accordingly.",
    scheduledFor: "June 6, 2026 at 8:00 AM",
    links: [],
    typeFieldValues: {},
  },
]

// ─── View As ────────────────────────────────────────────────────────────────

function ViewAsTab() {
  const { setUser } = useUser()
  const router = useRouter()
  const [selectedId, setSelectedId] = useState<string | undefined>()

  const handleSignIn = () => {
    const user = MOCK_USERS.find((u) => u.id === selectedId)
    if (!user) return
    setUser(user)
    router.push(user.role === "manager" ? "/lead" : "/")
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

interface DraftAnnouncementTabProps {
  scheduledDrawerOpen: boolean
  onScheduledDrawerClose: () => void
}

function DraftAnnouncementTab({ scheduledDrawerOpen, onScheduledDrawerClose }: DraftAnnouncementTabProps) {
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const [selectedType, setSelectedType] = useState<AnnouncementType>("General")
  const [links, setLinks] = useState<LinkRow[]>([{ label: "", url: "" }])
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [scheduleDate, setScheduleDate] = useState<dayjs.Dayjs | null>(null)
  const [scheduleTime, setScheduleTime] = useState<dayjs.Dayjs | null>(null)
  const [editingItem, setEditingItem] = useState<ScheduledAnnouncement | null>(null)
  const [editLinks, setEditLinks] = useState<LinkRow[]>([])
  const [editType, setEditType] = useState<AnnouncementType>("General")
  const [editScheduleDate, setEditScheduleDate] = useState<dayjs.Dayjs | null>(null)
  const [editScheduleTime, setEditScheduleTime] = useState<dayjs.Dayjs | null>(null)

  // New feature state
  const [bodyHtml, setBodyHtml] = useState("")
  const [attachments, setAttachments] = useState<UploadFile[]>([])
  const [recipients, setRecipients] = useState<"all" | "mine">("all")
  const [previewOpen, setPreviewOpen] = useState(false)

  const addLink = () => setLinks((prev) => [...prev, { label: "", url: "" }])
  const removeLink = (i: number) => setLinks((prev) => prev.filter((_, idx) => idx !== i))
  const updateLink = (i: number, field: keyof LinkRow, value: string) =>
    setLinks((prev) => prev.map((l, idx) => idx === i ? { ...l, [field]: value } : l))

  const resetForm = () => {
    form.resetFields()
    form.setFieldValue("type", "General")
    setSelectedType("General")
    setLinks([{ label: "", url: "" }])
    setBodyHtml("")
    setAttachments([])
    setRecipients("all")
  }

  const isBodyEmpty = (html: string) => !html || html.replace(/<[^>]*>/g, "").trim() === ""

  const handleSend = () => {
    form.validateFields().then(() => {
      if (isBodyEmpty(bodyHtml)) { message.warning("Body copy is required."); return }
      const recipientLabel = recipients === "all" ? "all referral partners" : "your partners"
      message.success(`Announcement sent to ${recipientLabel}.`)
      resetForm()
    })
  }

  const handleSchedule = () => {
    form.validateFields().then(() => {
      if (isBodyEmpty(bodyHtml)) { message.warning("Body copy is required."); return }
      if (!scheduleDate || !scheduleTime) { message.warning("Please select both a date and time."); return }
      const formatted = `${scheduleDate.format("MMMM D, YYYY")} at ${scheduleTime.format("h:mm A")}`
      message.success(`Announcement scheduled for ${formatted}.`)
      setScheduleOpen(false)
      resetForm()
      setScheduleDate(null)
      setScheduleTime(null)
    })
  }

  const handlePreview = () => {
    const values = form.getFieldsValue()
    if (!values.title && isBodyEmpty(bodyHtml)) {
      message.warning("Add a title and body copy to preview the announcement.")
      return
    }
    setPreviewOpen(true)
  }

  const openEditModal = (item: ScheduledAnnouncement) => {
    setEditingItem(item)
    setEditType(item.type)
    setEditLinks(item.links.length > 0 ? item.links : [{ label: "", url: "" }])
    editForm.resetFields()
    // Only pre-fill plain text fields — DatePicker/TimePicker require dayjs objects,
    // passing a raw string crashes the picker component at render time.
    const textFieldValues: Record<string, string> = {}
    typeFields[item.type].forEach((field) => {
      if (!field.fieldType && item.typeFieldValues[field.label] !== undefined) {
        textFieldValues[field.label] = item.typeFieldValues[field.label]
      }
    })
    editForm.setFieldsValue({ type: item.type, title: item.title, body: item.body, ...textFieldValues })
    // Parse "June 3, 2026 at 10:00 AM" into separate dayjs date and time values
    const [datePart, timePart] = item.scheduledFor.split(" at ")
    setEditScheduleDate(datePart ? dayjs(datePart, "MMMM D, YYYY") : null)
    setEditScheduleTime(timePart ? dayjs(timePart, "h:mm A") : null)
  }

  const handleEditSave = () => {
    editForm.validateFields().then(() => {
      message.success("Scheduled announcement updated.")
      setEditingItem(null)
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

            <Form.Item label="Recipients" name="recipients">
              <Radio.Group value={recipients} onChange={(e) => setRecipients(e.target.value)} optionType="button" buttonStyle="solid">
                <Radio.Button value="all">
                  <Space size={6}><TeamOutlined />All Referral Partners</Space>
                </Radio.Button>
                <Radio.Button value="mine">
                  <Space size={6}><UserOutlined />My Partners Only</Space>
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="Body Copy" required>
              <div className="announcement-quill-wrap">
                <style>{`.announcement-quill-wrap .ql-editor { min-height: 240px; max-height: 240px; overflow-y: auto; }`}</style>
                <ReactQuill
                  theme="snow"
                  value={bodyHtml}
                  onChange={setBodyHtml}
                  modules={quillModules}
                  placeholder="Write the full announcement content here…"
                />
              </div>
            </Form.Item>

            <Form.Item label="PDF Attachments">
              <Upload
                accept=".pdf"
                multiple
                fileList={attachments}
                beforeUpload={() => false}
                onChange={({ fileList }) => setAttachments(fileList)}
                iconRender={() => <PaperClipOutlined />}
              >
                <Button icon={<PaperClipOutlined />}>Attach PDF</Button>
              </Upload>
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
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Space wrap>
                  <Button icon={<EyeOutlined />} size="large" onClick={handlePreview}>
                    Preview
                  </Button>
                  <Button icon={<CalendarOutlined />} size="large" onClick={() => setScheduleOpen(true)}>
                    Schedule to Send Later
                  </Button>
                  <Button type="primary" icon={<SendOutlined />} size="large" onClick={handleSend}>
                    Send Now
                  </Button>
                </Space>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </Col>

      {/* ── Preview Drawer ── */}
      {(() => {
        const vals = form.getFieldsValue()
        const type: AnnouncementType = vals.type ?? "General"
        const detailFields = typeFields[type].filter(f => !f.fieldType && vals[f.label])
        const validLinks = links.filter(l => l.label || l.url)
        const validAttachments = attachments.filter(f => f.name)
        return (
          <Drawer
            open={previewOpen}
            onClose={() => setPreviewOpen(false)}
            width={560}
            placement="right"
            title={
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", width: "100%" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {type === "Urgent" && <WarningFilled style={{ color: "#ef4444", fontSize: 14 }} />}
                    <Text strong style={{ fontSize: 16, lineHeight: 1.3 }}>
                      {vals.title || <span style={{ color: "#9ca3af", fontWeight: 400 }}>Untitled Announcement</span>}
                    </Text>
                    <Tag color={announcementTagColor[type]} style={{ margin: 0, flexShrink: 0 }}>{type}</Tag>
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {dayjs().format("MMMM D, YYYY")} &middot; {recipients === "all" ? "All Referral Partners" : "My Partners Only"}
                  </Text>
                </div>
              </div>
            }
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Type-specific detail fields (text only) */}
              {detailFields.length > 0 && (
                <div style={{ background: "#f9fafb", borderRadius: 8, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                  {detailFields.map(f => (
                    <div key={f.label} style={{ display: "flex", gap: 12 }}>
                      <Text type="secondary" style={{ fontSize: 13, minWidth: 130, flexShrink: 0 }}>{f.label}</Text>
                      <Text style={{ fontSize: 13, fontWeight: 500 }}>{vals[f.label]}</Text>
                    </div>
                  ))}
                </div>
              )}

              {/* Rich text body */}
              {!isBodyEmpty(bodyHtml) ? (
                <div
                  className="ql-editor"
                  style={{ padding: 0, fontSize: 14, lineHeight: 1.7, color: "#374151" }}
                  dangerouslySetInnerHTML={{ __html: bodyHtml }}
                />
              ) : (
                <Text type="secondary" style={{ fontStyle: "italic" }}>No body copy yet.</Text>
              )}

              {/* PDF attachments */}
              {validAttachments.length > 0 && (
                <>
                  <Divider style={{ margin: 0 }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <Text strong style={{ fontSize: 13, color: "#374151" }}>Attachments</Text>
                    {validAttachments.map((f) => (
                      <div key={f.uid} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, color: "#2d5f4a", fontWeight: 500 }}>
                        <PaperClipOutlined style={{ fontSize: 13 }} />
                        {f.name}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Related links */}
              {validLinks.length > 0 && (
                <>
                  <Divider style={{ margin: 0 }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <Text strong style={{ fontSize: 13, color: "#374151" }}>Related Links</Text>
                    {validLinks.map((l, i) => (
                      <a
                        key={i}
                        href={l.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, color: "#2d5f4a", fontWeight: 500 }}
                      >
                        <LinkOutlined style={{ fontSize: 13 }} />
                        {l.label || l.url}
                      </a>
                    ))}
                  </div>
                </>
              )}
            </div>
          </Drawer>
        )
      })()}

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

      {/* ── Scheduled Announcements Drawer ── */}
      <Drawer
        title="Scheduled Announcements"
        placement="right"
        width={420}
        open={scheduledDrawerOpen}
        onClose={onScheduledDrawerClose}
      >
        <List
          dataSource={mockScheduled}
          itemLayout="vertical"
          renderItem={(item) => (
            <List.Item
              key={item.id}
              style={{ cursor: "pointer", padding: "12px 8px", borderRadius: 8, transition: "background 0.15s" }}
              onClick={() => { openEditModal(item); onScheduledDrawerClose() }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Tag color={announcementTagColor[item.type]} style={{ margin: 0 }}>{item.type}</Tag>
                  <Text strong style={{ fontSize: 14 }}>{item.title}</Text>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#6b7280", fontSize: 12, marginTop: 2 }}>
                  <ClockCircleOutlined />
                  <span>Scheduled for {item.scheduledFor}</span>
                </div>
                <Text type="secondary" style={{ fontSize: 12, marginTop: 2 }} ellipsis={{ tooltip: item.body }}>
                  {item.body}
                </Text>
              </div>
            </List.Item>
          )}
        />
      </Drawer>

      {/* ── Edit Scheduled Announcement Modal ── */}
      <Modal
        title={
          <Space>
            <EditOutlined />
            <span>Edit Scheduled Announcement</span>
          </Space>
        }
        open={!!editingItem}
        onCancel={() => { setEditingItem(null); setEditScheduleDate(null); setEditScheduleTime(null) }}
        onOk={handleEditSave}
        okText="Save Changes"
        width={700}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical" requiredMark={false} style={{ marginTop: 16 }}>
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
                  onChange={(v) => { setEditType(v); editForm.resetFields(typeFields[v as AnnouncementType].map(f => f.label)) }}
                  options={announcementTypes.map((t) => ({
                    value: t,
                    label: <Tag color={announcementTagColor[t]} style={{ margin: 0 }}>{t}</Tag>,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>

          {editType && typeFields[editType].length > 0 && (
            <>
              <Divider orientation="left" orientationMargin={0} style={{ fontSize: 12, color: "#9ca3af", marginTop: 0 }}>
                {editType} Details
              </Divider>
              <Row gutter={16}>
                {typeFields[editType].map((field) => (
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
              placeholder="Write the full announcement content here."
              rows={6}
              style={{ resize: "vertical" }}
            />
          </Form.Item>

          <Form.Item label="Related Links">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {editLinks.map((link, i) => (
                <Space key={i} style={{ width: "100%" }} align="start">
                  <Input
                    placeholder="Label"
                    value={link.label}
                    onChange={(e) => setEditLinks((prev) => prev.map((l, idx) => idx === i ? { ...l, label: e.target.value } : l))}
                    style={{ width: 160 }}
                  />
                  <Input
                    placeholder="https://..."
                    value={link.url}
                    onChange={(e) => setEditLinks((prev) => prev.map((l, idx) => idx === i ? { ...l, url: e.target.value } : l))}
                    style={{ width: 260 }}
                  />
                  {editLinks.length > 1 && (
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => setEditLinks((prev) => prev.filter((_, idx) => idx !== i))} />
                  )}
                </Space>
              ))}
              <Button type="dashed" icon={<PlusOutlined />} onClick={() => setEditLinks((prev) => [...prev, { label: "", url: "" }])} style={{ alignSelf: "flex-start", marginTop: 4 }}>
                Add Link
              </Button>
            </div>
          </Form.Item>

          <Divider orientation="left" orientationMargin={0} style={{ fontSize: 12, color: "#9ca3af", margin: "8px 0 16px" }}>
            Scheduled Send Time
          </Divider>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, color: "#374151" }}>Send Date</div>
                <DatePicker
                  value={editScheduleDate}
                  onChange={setEditScheduleDate}
                  style={{ width: "100%" }}
                  size="large"
                  format="MMMM D, YYYY"
                  disabledDate={(d) => d.isBefore(dayjs().startOf("day"))}
                />
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6, color: "#374151" }}>Send Time</div>
                <TimePicker
                  value={editScheduleTime}
                  onChange={setEditScheduleTime}
                  style={{ width: "100%" }}
                  size="large"
                  use12Hours
                  format="h:mm A"
                  minuteStep={15}
                />
              </div>
            </Col>
          </Row>
        </Form>
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
  const [scheduledDrawerOpen, setScheduledDrawerOpen] = useState(false)

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f9fafb" }}>
      <AdminHeader activeKey={activeTab} onSelect={setActiveTab} />
      <main style={{ width: "100%", maxWidth: 1200, margin: "0 auto", flex: 1, padding: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <Title level={3} style={{ margin: 0, fontWeight: 600, color: "#111" }}>
            {tabTitles[activeTab]}
          </Title>
          {activeTab === "draft-announcement" && (
            <Button icon={<CalendarOutlined />} onClick={() => setScheduledDrawerOpen(true)}>
              View Scheduled
            </Button>
          )}
        </div>
        {activeTab === "view-as" && <ViewAsTab />}
        {activeTab === "draft-announcement" && (
          <DraftAnnouncementTab
            scheduledDrawerOpen={scheduledDrawerOpen}
            onScheduledDrawerClose={() => setScheduledDrawerOpen(false)}
          />
        )}
        {activeTab === "customize" && <CustomizeTab />}
      </main>
      <Footer />
    </div>
  )
}
