"use client"

import { Card, Typography, Tag, Divider } from "antd"
import { announcements, announcementTagColor } from "@/lib/mock-announcements"

export function AnnouncementsCard() {
  return (
    <Card
      title={<Typography.Text strong>Announcements</Typography.Text>}
      variant="bordered"
      style={{ flex: 1, overflow: "hidden" }}
      styles={{ body: { padding: 0, overflowY: "auto", maxHeight: 480 } }}
    >
      {announcements.map((a, i) => (
        <div key={a.id}>
          <div style={{ padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <Tag color={announcementTagColor[a.type]}>{a.type}</Tag>
              <Typography.Text type="secondary" style={{ fontSize: 11 }}>{a.date}</Typography.Text>
            </div>
            <Typography.Text strong style={{ display: "block", marginBottom: 4, fontSize: 13 }}>{a.title}</Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12, lineHeight: 1.5 }}>{a.body}</Typography.Text>
          </div>
          {i < announcements.length - 1 && <Divider style={{ margin: 0 }} />}
        </div>
      ))}
    </Card>
  )
}
