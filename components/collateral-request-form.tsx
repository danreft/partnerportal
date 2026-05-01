"use client"

import { useState } from "react"
import {
  Card, Form, Input, InputNumber, Select, Button,
  Typography, Divider, Upload, Space, Row, Col, message, Alert,
} from "antd"
import { UploadOutlined, SendOutlined, InboxOutlined } from "@ant-design/icons"
import type { UploadFile } from "antd"

const { Text } = Typography
const { Dragger } = Upload

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "District of Columbia", "Florida", "Georgia",
  "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota",
  "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia",
  "Washington", "West Virginia", "Wisconsin", "Wyoming",
]

interface FormValues {
  firstName: string
  lastName: string
  phone: string
  address1: string
  address2: string
  city: string
  state: string
  zip: string
  qtyOneSheeter: number
  qtyFolderPackets: number
  qtyBusinessCards: number
  additionalInfo: string
}

const EMPTY: FormValues = {
  firstName: "", lastName: "", phone: "",
  address1: "", address2: "", city: "", state: "", zip: "",
  qtyOneSheeter: 0, qtyFolderPackets: 0, qtyBusinessCards: 0,
  additionalInfo: "",
}

export function CollateralRequestForm() {
  const [values, setValues] = useState<FormValues>(EMPTY)
  const [logoFileList, setLogoFileList] = useState<UploadFile[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()

  function set<K extends keyof FormValues>(key: K, val: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: val }))
  }

  function handleSubmit() {
    const required: Array<[keyof FormValues, string]> = [
      ["firstName", "First Name"], ["lastName", "Last Name"], ["phone", "Phone"],
      ["address1", "Address Line 1"], ["city", "City"], ["state", "State"], ["zip", "Zip Code"],
    ]
    for (const [key, label] of required) {
      if (!values[key]) {
        messageApi.error(`${label} is required.`)
        return
      }
    }
    setSubmitted(true)
  }

  function handleReset() {
    setValues(EMPTY)
    setLogoFileList([])
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <Card variant="bordered">
        <div style={{ padding: "48px 0", textAlign: "center" }}>
          <Alert
            type="success"
            showIcon
            message="Request Submitted"
            description={`Thank you, ${values.firstName}! Your collateral request has been received. We'll mail your materials to ${values.address1}, ${values.city}, ${values.state} ${values.zip}.`}
            style={{ maxWidth: 520, margin: "0 auto 24px" }}
          />
          <Button onClick={handleReset}>Submit Another Request</Button>
        </div>
      </Card>
    )
  }

  return (
    <>
      {contextHolder}
      <Card
        title={<Text strong>Referral Partner Collateral Request</Text>}
        variant="bordered"
        style={{ width: "100%" }}
      >
        <Form layout="vertical">

          {/* Contact Information */}
          <div style={{ marginBottom: 8 }}>
            <Text strong style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.6, color: "#6b7280" }}>Contact Information</Text>
          </div>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="First Name" required style={{ marginBottom: 16 }}>
                <Input
                  value={values.firstName}
                  onChange={e => set("firstName", e.target.value)}
                  placeholder="First"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Last Name" required style={{ marginBottom: 16 }}>
                <Input
                  value={values.lastName}
                  onChange={e => set("lastName", e.target.value)}
                  placeholder="Last"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Phone"
            required
            style={{ marginBottom: 16 }}
            extra="This number will be used on flyer or business card."
          >
            <Input
              value={values.phone}
              onChange={e => set("phone", e.target.value)}
              placeholder="(555) 555-5555"
            />
          </Form.Item>

          <Divider style={{ margin: "4px 0 20px" }} />

          {/* Mailing Address */}
          <div style={{ marginBottom: 8 }}>
            <Text strong style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.6, color: "#6b7280" }}>Address That Collateral Will Be Mailed To</Text>
          </div>

          <Form.Item label="Address Line 1" required style={{ marginBottom: 16 }}>
            <Input
              value={values.address1}
              onChange={e => set("address1", e.target.value)}
              placeholder="Street address"
            />
          </Form.Item>

          <Form.Item label="Address Line 2" style={{ marginBottom: 16 }}>
            <Input
              value={values.address2}
              onChange={e => set("address2", e.target.value)}
              placeholder="Apt, suite, unit, etc. (optional)"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={10}>
              <Form.Item label="City" required style={{ marginBottom: 16 }}>
                <Input
                  value={values.city}
                  onChange={e => set("city", e.target.value)}
                  placeholder="City"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="State" required style={{ marginBottom: 16 }}>
                <Select
                  value={values.state || undefined}
                  onChange={v => set("state", v)}
                  placeholder="Select state"
                  showSearch
                  options={US_STATES.map(s => ({ label: s, value: s }))}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Zip Code" required style={{ marginBottom: 16 }}>
                <Input
                  value={values.zip}
                  onChange={e => set("zip", e.target.value)}
                  placeholder="00000"
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider style={{ margin: "4px 0 20px" }} />

          {/* Collateral Type */}
          <div style={{ marginBottom: 8 }}>
            <Text strong style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.6, color: "#6b7280" }}>Requested Collateral Type</Text>
          </div>
          <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 16 }}>
            If you do not want one of the following options, leave the quantity as 0.
          </Text>

          <Form.Item label="One Sheeter (With Your Custom QR Code and RP Code)" style={{ marginBottom: 16 }}>
            <InputNumber
              min={0}
              style={{ width: 120 }}
              value={values.qtyOneSheeter}
              onChange={v => set("qtyOneSheeter", v ?? 0)}
            />
          </Form.Item>

          <Form.Item label="General Info Folder Packets" style={{ marginBottom: 16 }}>
            <InputNumber
              min={0}
              style={{ width: 120 }}
              value={values.qtyFolderPackets}
              onChange={v => set("qtyFolderPackets", v ?? 0)}
            />
          </Form.Item>

          <Form.Item label="Business Cards (With Your Custom QR Code and RP Code)" style={{ marginBottom: 16 }}>
            <InputNumber
              min={0}
              style={{ width: 120 }}
              value={values.qtyBusinessCards}
              onChange={v => set("qtyBusinessCards", v ?? 0)}
            />
          </Form.Item>

          <Divider style={{ margin: "4px 0 20px" }} />

          {/* Logo & Additional */}
          <div style={{ marginBottom: 8 }}>
            <Text strong style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.6, color: "#6b7280" }}>Logo &amp; Additional Information</Text>
          </div>

          <Form.Item
            label="Upload Your Logo"
            style={{ marginBottom: 16 }}
            extra="If you would like your logo on the one sheeters, upload a hi-res PNG file."
          >
            <Dragger
              accept="image/png,image/jpeg,image/svg+xml"
              fileList={logoFileList}
              beforeUpload={() => false}
              onChange={info => setLogoFileList(info.fileList.slice(-1))}
              maxCount={1}
              style={{ padding: "8px 0" }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: "#4a9d6f" }} />
              </p>
              <p style={{ margin: "4px 0", fontSize: 14 }}>Drag &amp; drop or click to upload</p>
              <p style={{ color: "#9ca3af", fontSize: 12 }}>Hi-res PNG preferred</p>
            </Dragger>
          </Form.Item>

          <Form.Item label="Any additional information we should know?" style={{ marginBottom: 24 }}>
            <Input.TextArea
              value={values.additionalInfo}
              onChange={e => set("additionalInfo", e.target.value)}
              rows={4}
              placeholder="Optional notes or special instructions..."
            />
          </Form.Item>

          <Button
            type="primary"
            icon={<SendOutlined />}
            size="large"
            onClick={handleSubmit}
            style={{ width: "100%" }}
          >
            Submit Request
          </Button>

        </Form>
      </Card>
    </>
  )
}
