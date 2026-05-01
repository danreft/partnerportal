"use client"

import { useState, useRef } from "react"
import {
  Card, Form, Input, InputNumber, DatePicker, Radio, Button,
  Typography, Divider, Upload, Space, Row, Col, message,
} from "antd"
import {
  PrinterOutlined, DownloadOutlined, UploadOutlined, DeleteOutlined,
} from "@ant-design/icons"
import type { UploadFile } from "antd"
import dayjs, { type Dayjs } from "dayjs"

const { Text, Title } = Typography

interface InvoiceValues {
  businessName: string
  businessAddress: string
  clientName: string
  clientAddress: string
  invoiceNumber: string
  invoiceDate: Dayjs | null
  dueDate: Dayjs | null
  terms: string
  qty: number | null
  rate: number | null
  discount: number | null
  notes: string
}

const EMPTY: InvoiceValues = {
  businessName: "",
  businessAddress: "",
  clientName: "",
  clientAddress: "",
  invoiceNumber: "",
  invoiceDate: null,
  dueDate: null,
  terms: "Due on Receipt",
  qty: null,
  rate: null,
  discount: null,
  notes: "",
}

function fmt(n: number) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function InvoicePreview({
  values,
  logoUrl,
  printRef,
}: {
  values: InvoiceValues
  logoUrl: string | null
  printRef: React.RefObject<HTMLDivElement | null>
}) {
  const subtotal = (values.qty ?? 0) * (values.rate ?? 0)
  const discount = values.discount ?? 0
  const total = Math.max(0, subtotal - discount)

  return (
    <div
      ref={printRef}
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: "32px 36px",
        fontFamily: "inherit",
        fontSize: 14,
        color: "#111",
        minHeight: 560,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          {logoUrl && (
            <img src={logoUrl} alt="Logo" style={{ maxHeight: 64, maxWidth: 180, objectFit: "contain", marginBottom: 8, display: "block" }} />
          )}
          <div style={{ fontWeight: 700, fontSize: 16, color: "#111" }}>{values.businessName || <span style={{ color: "#9ca3af" }}>Business Name</span>}</div>
          <div style={{ color: "#6b7280", whiteSpace: "pre-line", marginTop: 2, fontSize: 13 }}>{values.businessAddress || <span style={{ color: "#d1d5db" }}>Address / Contact</span>}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 26, fontWeight: 700, color: "#4a9d6f", letterSpacing: -0.5 }}>INVOICE</div>
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
            <span style={{ fontWeight: 500 }}>Invoice #:</span> {values.invoiceNumber || "—"}
          </div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>
            <span style={{ fontWeight: 500 }}>Date:</span> {values.invoiceDate ? values.invoiceDate.format("MM/DD/YYYY") : "—"}
          </div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>
            <span style={{ fontWeight: 500 }}>Due:</span> {values.dueDate ? values.dueDate.format("MM/DD/YYYY") : "—"}
          </div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>
            <span style={{ fontWeight: 500 }}>Terms:</span> {values.terms}
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div style={{ background: "#f9fafb", borderRadius: 6, padding: "12px 16px", marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, color: "#6b7280", marginBottom: 4 }}>Bill To</div>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{values.clientName || <span style={{ color: "#9ca3af" }}>Client / Farm Name</span>}</div>
        <div style={{ color: "#6b7280", whiteSpace: "pre-line", fontSize: 13, marginTop: 2 }}>{values.clientAddress || <span style={{ color: "#d1d5db" }}>Client Address</span>}</div>
      </div>

      {/* Line Items Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
        <thead>
          <tr style={{ background: "#4a9d6f" }}>
            <th style={{ textAlign: "left", padding: "8px 12px", color: "#fff", fontWeight: 600, fontSize: 12, borderRadius: "6px 0 0 0" }}>Description</th>
            <th style={{ textAlign: "right", padding: "8px 12px", color: "#fff", fontWeight: 600, fontSize: 12 }}>Qty / Acres</th>
            <th style={{ textAlign: "right", padding: "8px 12px", color: "#fff", fontWeight: 600, fontSize: 12 }}>Rate / Acre</th>
            <th style={{ textAlign: "right", padding: "8px 12px", color: "#fff", fontWeight: 600, fontSize: 12, borderRadius: "0 6px 0 0" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
            <td style={{ padding: "10px 12px", fontSize: 13 }}>Concierge Service Fee</td>
            <td style={{ padding: "10px 12px", textAlign: "right", fontSize: 13 }}>{values.qty != null ? values.qty : "—"}</td>
            <td style={{ padding: "10px 12px", textAlign: "right", fontSize: 13 }}>{values.rate != null ? `$${fmt(values.rate)}` : "—"}</td>
            <td style={{ padding: "10px 12px", textAlign: "right", fontSize: 13, fontWeight: 500 }}>{values.qty != null && values.rate != null ? `$${fmt(subtotal)}` : "—"}</td>
          </tr>
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
        <div style={{ width: 220 }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13 }}>
            <span style={{ color: "#6b7280" }}>Subtotal</span>
            <span>{values.qty != null && values.rate != null ? `$${fmt(subtotal)}` : "—"}</span>
          </div>
          {discount > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13 }}>
              <span style={{ color: "#6b7280" }}>Discount</span>
              <span style={{ color: "#dc2626" }}>−${fmt(discount)}</span>
            </div>
          )}
          <Divider style={{ margin: "8px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontWeight: 700, fontSize: 15 }}>
            <span>Total</span>
            <span style={{ color: "#4a9d6f" }}>{values.qty != null && values.rate != null ? `$${fmt(total)}` : "—"}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {values.notes && (
        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 16, marginTop: 4 }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, color: "#6b7280", marginBottom: 6 }}>Notes / Payment Instructions</div>
          <div style={{ fontSize: 13, color: "#374151", whiteSpace: "pre-line" }}>{values.notes}</div>
        </div>
      )}
    </div>
  )
}

export function ConciergeInvoiceGenerator() {
  const [values, setValues] = useState<InvoiceValues>(EMPTY)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const printRef = useRef<HTMLDivElement>(null)
  const [messageApi, contextHolder] = message.useMessage()

  function set<K extends keyof InvoiceValues>(key: K, val: InvoiceValues[K]) {
    setValues((prev) => ({ ...prev, [key]: val }))
  }

  function handleLogoChange(info: { fileList: UploadFile[] }) {
    const latest = info.fileList.slice(-1)
    setFileList(latest)
    const file = latest[0]?.originFileObj
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setLogoUrl(e.target?.result as string)
      reader.readAsDataURL(file)
    } else {
      setLogoUrl(null)
    }
  }

  function handlePrint() {
    const node = printRef.current
    if (!node) return
    const win = window.open("", "_blank")
    if (!win) return
    win.document.write(`<html><head><title>Invoice</title><style>
      body { font-family: sans-serif; margin: 40px; color: #111; }
      table { width: 100%; border-collapse: collapse; }
      th { background: #4a9d6f; color: #fff; padding: 8px 12px; font-size: 12px; }
      td { padding: 10px 12px; font-size: 13px; border-bottom: 1px solid #e5e7eb; }
      .text-right { text-align: right; }
      @media print { body { margin: 20px; } }
    </style></head><body>`)
    win.document.write(node.innerHTML)
    win.document.write("</body></html>")
    win.document.close()
    win.focus()
    win.print()
    win.close()
  }

  function handleDownload() {
    messageApi.info("PDF download requires a server-side PDF library. Use Print → Save as PDF for now.")
  }

  return (
    <>
      {contextHolder}
      <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 24, alignItems: "start" }}>

        {/* Left: Form */}
        <Card title={<Text strong>Invoice Details</Text>} variant="bordered" style={{ position: "sticky", top: 24 }}>
          <Form layout="vertical" size="middle">

            {/* Your Business */}
            <div style={{ marginBottom: 4 }}>
              <Text strong style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.6, color: "#6b7280" }}>Your Business</Text>
            </div>
            <Form.Item label="Logo" style={{ marginBottom: 12 }}>
              <Space direction="vertical" size={4} style={{ width: "100%" }}>
                <Upload
                  accept="image/*"
                  fileList={fileList}
                  beforeUpload={() => false}
                  onChange={handleLogoChange}
                  maxCount={1}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />} style={{ width: "100%" }}>Upload Logo (optional)</Button>
                </Upload>
                {logoUrl && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <img src={logoUrl} alt="logo preview" style={{ height: 36, maxWidth: 120, objectFit: "contain", borderRadius: 4, border: "1px solid #e5e7eb" }} />
                    <Button size="small" icon={<DeleteOutlined />} danger onClick={() => { setLogoUrl(null); setFileList([]) }} />
                  </div>
                )}
              </Space>
            </Form.Item>
            <Form.Item label="Business Name" style={{ marginBottom: 12 }}>
              <Input value={values.businessName} onChange={e => set("businessName", e.target.value)} placeholder="e.g. Smith Agronomy LLC" />
            </Form.Item>
            <Form.Item label="Address / Contact" style={{ marginBottom: 16 }}>
              <Input.TextArea value={values.businessAddress} onChange={e => set("businessAddress", e.target.value)} placeholder={"123 Farm Rd, Ames, IA 50010\n(555) 555-5555"} rows={2} />
            </Form.Item>

            <Divider style={{ margin: "4px 0 16px" }} />

            {/* Bill To */}
            <div style={{ marginBottom: 4 }}>
              <Text strong style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.6, color: "#6b7280" }}>Bill To</Text>
            </div>
            <Form.Item label="Client / Farm Name" style={{ marginBottom: 12 }}>
              <Input value={values.clientName} onChange={e => set("clientName", e.target.value)} placeholder="e.g. Roger Bohenkamp" />
            </Form.Item>
            <Form.Item label="Client Address" style={{ marginBottom: 16 }}>
              <Input.TextArea value={values.clientAddress} onChange={e => set("clientAddress", e.target.value)} placeholder={"456 Prairie Ave, Ames, IA 50010"} rows={2} />
            </Form.Item>

            <Divider style={{ margin: "4px 0 16px" }} />

            {/* Invoice Details */}
            <div style={{ marginBottom: 4 }}>
              <Text strong style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.6, color: "#6b7280" }}>Invoice Details</Text>
            </div>
            <Form.Item label="Invoice #" style={{ marginBottom: 12 }}>
              <Input value={values.invoiceNumber} onChange={e => set("invoiceNumber", e.target.value)} placeholder="e.g. INV-001" />
            </Form.Item>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item label="Invoice Date" style={{ marginBottom: 12 }}>
                  <DatePicker style={{ width: "100%" }} value={values.invoiceDate} onChange={d => set("invoiceDate", d)} format="MM/DD/YYYY" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Due Date" style={{ marginBottom: 12 }}>
                  <DatePicker style={{ width: "100%" }} value={values.dueDate} onChange={d => set("dueDate", d)} format="MM/DD/YYYY" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Terms" style={{ marginBottom: 16 }}>
              <Radio.Group value={values.terms} onChange={e => set("terms", e.target.value)}>
                <Space direction="vertical" size={4}>
                  <Radio value="Due on Receipt">Due on Receipt</Radio>
                  <Radio value="Net 15">Net 15</Radio>
                  <Radio value="Net 30">Net 30</Radio>
                  <Radio value="Net 60">Net 60</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>

            <Divider style={{ margin: "4px 0 16px" }} />

            {/* Service Fee */}
            <div style={{ marginBottom: 4 }}>
              <Text strong style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.6, color: "#6b7280" }}>Concierge Service Fee</Text>
            </div>
            <Row gutter={12}>
              <Col span={12}>
                <Form.Item label="Qty / Acres" style={{ marginBottom: 12 }}>
                  <InputNumber style={{ width: "100%" }} min={0} value={values.qty} onChange={v => set("qty", v)} placeholder="e.g. 1020" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Rate Per Acre ($)" style={{ marginBottom: 12 }}>
                  <InputNumber style={{ width: "100%" }} min={0} prefix="$" precision={2} value={values.rate} onChange={v => set("rate", v)} placeholder="0.00" />
                </Form.Item>
              </Col>
            </Row>

            <Divider style={{ margin: "4px 0 16px" }} />

            {/* Additional */}
            <div style={{ marginBottom: 4 }}>
              <Text strong style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.6, color: "#6b7280" }}>Additional</Text>
            </div>
            <Form.Item label="Discount ($)" style={{ marginBottom: 12 }}>
              <InputNumber style={{ width: "100%" }} min={0} prefix="$" precision={2} value={values.discount} onChange={v => set("discount", v)} placeholder="0.00" />
            </Form.Item>
            <Form.Item label="Notes / Payment Instructions" style={{ marginBottom: 0 }}>
              <Input.TextArea value={values.notes} onChange={e => set("notes", e.target.value)} placeholder="e.g. Please make checks payable to Smith Agronomy LLC" rows={3} />
            </Form.Item>
          </Form>
        </Card>

        {/* Right: Preview */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Text strong style={{ fontSize: 15 }}>Invoice Preview</Text>
            <Space>
              <Button icon={<PrinterOutlined />} onClick={handlePrint}>Print</Button>
              <Button icon={<DownloadOutlined />} type="primary" onClick={handleDownload}>Download PDF</Button>
            </Space>
          </div>
          <InvoicePreview values={values} logoUrl={logoUrl} printRef={printRef} />
        </div>
      </div>
    </>
  )
}
