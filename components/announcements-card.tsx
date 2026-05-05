"use client"

import { useState } from "react"
import { Card, Typography, Tag, Divider, Button, Drawer, Space } from "antd"
import { LeftOutlined, RightOutlined, LinkOutlined } from "@ant-design/icons"
import { announcements, announcementTagColor, type Announcement } from "@/lib/mock-announcements"

function AnnouncementDrawerContent({ announcement }: { announcement: Announcement }) {
  const paragraphs = announcement.fullBody.split("\n\n").filter(Boolean)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Details table */}
      {announcement.details && announcement.details.length > 0 && (
        <div style={{ background: "#f9fafb", borderRadius: 8, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
          {announcement.details.map((d) => (
            <div key={d.label} style={{ display: "flex", gap: 12 }}>
              <Typography.Text type="secondary" style={{ fontSize: 13, minWidth: 130, flexShrink: 0 }}>{d.label}</Typography.Text>
              <Typography.Text style={{ fontSize: 13, fontWeight: 500 }}>{d.value}</Typography.Text>
            </div>
          ))}
        </div>
      )}

      {/* Full body */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {paragraphs.map((para, i) => (
          <Typography.Paragraph key={i} style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "#374151" }}>
            {para}
          </Typography.Paragraph>
        ))}
      </div>

      {/* Links */}
      {announcement.links && announcement.links.length > 0 && (
        <>
          <Divider style={{ margin: 0 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Typography.Text strong style={{ fontSize: 13, color: "#374151" }}>Related Links</Typography.Text>
            {announcement.links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14, color: "#2d5f4a", fontWeight: 500 }}
              >
                <LinkOutlined style={{ fontSize: 13 }} />
                {link.label}
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function AnnouncementsCard() {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const openDrawer = (index: number) => {
    setActiveIndex(index)
    setOpen(true)
  }

  const active = announcements[activeIndex]

  return (
    <>
      <Card
        title={<Typography.Text strong>Announcements</Typography.Text>}
        variant="bordered"
        style={{ overflow: "hidden" }}
        styles={{ body: { padding: 0, overflowY: "auto", maxHeight: 541 } }}
      >
        {announcements.map((a, i) => (
          <div key={a.id}>
            <div style={{ padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <Typography.Text strong style={{ fontSize: 13 }}>{a.title}</Typography.Text>
                <Tag color={announcementTagColor[a.type]} style={{ margin: 0, flexShrink: 0 }}>{a.type}</Tag>
              </div>
              <Typography.Text type="secondary" style={{ fontSize: 11, display: "block", marginBottom: 4 }}>{a.date}</Typography.Text>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                <div style={{ flex: 1, fontSize: 12, lineHeight: 1.5, color: "#8c8c8c", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{a.body}</div>
                <Button size="small" type="default" style={{ flexShrink: 0 }} onClick={() => openDrawer(i)}>View</Button>
              </div>
            </div>
            {i < announcements.length - 1 && <Divider style={{ margin: 0 }} />}
          </div>
        ))}
      </Card>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        width={560}
        placement="right"
        title={
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", width: "100%" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Typography.Text strong style={{ fontSize: 16, lineHeight: 1.3 }}>{active.title}</Typography.Text>
                <Tag color={announcementTagColor[active.type]} style={{ margin: 0, flexShrink: 0 }}>{active.type}</Tag>
              </div>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>{active.date}</Typography.Text>
            </div>
            <Space size={4} style={{ flexShrink: 0, marginLeft: 16, marginTop: 2 }}>
              <Button
                icon={<LeftOutlined />}
                size="small"
                type="text"
                disabled={activeIndex === 0}
                onClick={() => setActiveIndex((i) => i - 1)}
                title="Previous announcement"
              />
              <Button
                icon={<RightOutlined />}
                size="small"
                type="text"
                disabled={activeIndex === announcements.length - 1}
                onClick={() => setActiveIndex((i) => i + 1)}
                title="Next announcement"
              />
            </Space>
          </div>
        }
      >
        <AnnouncementDrawerContent announcement={active} />
      </Drawer>
    </>
  )
}
