export interface LeadData {
  key: string
  leadName: string
  acres: string
  submissionDate: string
  // Mock: closed date for won/lost etc.
  closedDate?: string
  stage: string
  stageColor: string
  // Optional: when a lead is lost, capture the reason
  lostReason?: string
  lostComment?: string
  // CRM/Attribution fields (mocked)
  referralCode?: string // Referral Partner code used for attribution
  pipeline?: string // e.g., "Soil Nutrient Load Pipeline"
  crmStage?: string // e.g., "Inbound Calls", "Invitation Email"
  dealStatus?: "Open" | "Closed" // Derived in UI if not set
  contact: {
    name: string
    email: string
    phone: string
  }
  progress?: {
    stages: Array<{
      name: string
      completed: boolean
      date?: string
      current?: boolean
    }>
  }
}

// date util to add days to an MM/DD/YYYY string and return MM/DD/YYYY
function addDays(dateStr: string, days: number): string {
  const [mm, dd, yyyy] = dateStr.split("/").map((s) => parseInt(s, 10))
  const d = new Date(yyyy, (mm || 1) - 1, dd || 1)
  d.setDate(d.getDate() + days)
  const m = (d.getMonth() + 1).toString().padStart(2, "0")
  const day = d.getDate().toString().padStart(2, "0")
  const y = d.getFullYear().toString()
  return `${m}/${day}/${y}`
}

// Returns how many days the lead has been in its current stage.
// Uses the current stage's date if set, otherwise the last completed stage's date,
// falling back to the submission date.
export function daysInCurrentStage(lead: LeadData): number {
  const stages = lead.progress?.stages ?? []
  const currentStage = stages.find((s) => s.current)
  const completedWithDate = stages.filter((s) => s.completed && s.date)

  const refDate =
    currentStage?.date ??
    completedWithDate[completedWithDate.length - 1]?.date ??
    lead.submissionDate

  if (!refDate) return 0
  return Math.floor((Date.now() - new Date(refDate).getTime()) / (1000 * 60 * 60 * 24))
}

export function isLeadStalled(lead: LeadData): boolean {
  if (lead.stage === "Won" || lead.stage === "Lost") return false
  return daysInCurrentStage(lead) > 30
}

// Returns the MM/DD/YYYY date when the lead entered Stalled (ref date + 30 days), or null if not stalled.
export function getStalledDate(lead: LeadData): string | null {
  if (!isLeadStalled(lead)) return null
  const stages = lead.progress?.stages ?? []
  const currentStage = stages.find((s) => s.current)
  const completedWithDate = stages.filter((s) => s.completed && s.date)
  const refDateStr =
    currentStage?.date ??
    completedWithDate[completedWithDate.length - 1]?.date ??
    lead.submissionDate
  if (!refDateStr) return null
  return addDays(refDateStr, 30)
}

export const leadsData: LeadData[] = [
  {
    key: "1",
    leadName: "Roger Bohenkamp",
    acres: "1,020 acres",
    submissionDate: "04/01/2026",
    stage: "Invitation Sent",
    stageColor: "blue",
    referralCode: "JSMITH2024",
    pipeline: "Soil Nutrient Load Pipeline",
    crmStage: "Invitation Email",
    dealStatus: "Open",
    contact: {
      name: "Roger Bohenkamp",
      email: "roger.bohenkamp@williamscompany.com",
      phone: "(555) 555-5555",
    },
    progress: {
      stages: [
        { name: "Contact Form Submitted", completed: true, date: "02/21/2026" },
        { name: "Request for Services Submitted", completed: true, date: "03/01/2026" },
        { name: "Agreement Sent", completed: true, date: "03/12/2026" },
        { name: "Service Contract Under Review", completed: true },
        { name: "Soil Data Collection", completed: false, current: true },
        { name: "Analyst Team", completed: false },
        { name: "Report Complete/Not Paid", completed: false },
        { name: "Won", completed: false },
      ],
    },
  },
  // Won deals mock data
  {
    key: "10",
    leadName: "Green Valley Partners",
    acres: "520 acres",
    submissionDate: "04/17/2026",
    closedDate: "04/17/2026",
    stage: "Won",
    stageColor: "green",
    referralCode: "OTHER2024",
    pipeline: "Soil Nutrient Load Pipeline",
    crmStage: "Report Complete/Not Paid",
    dealStatus: "Closed",
    contact: {
      name: "Lena Hart",
      email: "lena.hart@greenvalley.com",
      phone: "(555) 555-5610",
    },
    progress: {
      stages: [
        { name: "Contact Form Submitted", completed: true, date: "03/12/2026" },
        { name: "Request for Services Submitted", completed: true, date: "03/18/2026" },
        { name: "Agreement Sent", completed: true, date: "03/22/2026" },
        { name: "Service Contract Under Review", completed: true, date: "03/28/2026" },
        { name: "Soil Data Collection", completed: true, date: "04/02/2026" },
        { name: "Analyst Team", completed: true, date: "04/08/2026" },
        { name: "Report Complete/Not Paid", completed: true, date: "04/12/2026" },
        { name: "Won", completed: true, date: "04/17/2026" },
      ],
    },
  },
  {
    key: "11",
    leadName: "Blue River Co-op",
    acres: "305 acres",
    submissionDate: "04/19/2026",
    closedDate: "04/19/2026",
    stage: "Won",
    stageColor: "green",
    referralCode: "JSMITH2024",
    pipeline: "Soil Nutrient Load Pipeline",
    crmStage: "Won",
    dealStatus: "Closed",
    contact: {
      name: "Marcus Lee",
      email: "mlee@blueriver.coop",
      phone: "(555) 555-5611",
    },
    progress: {
      stages: [
        { name: "Contact Form Submitted", completed: true, date: "03/20/2026" },
        { name: "Request for Services Submitted", completed: true, date: "03/24/2026" },
        { name: "Agreement Sent", completed: true, date: "03/29/2026" },
        { name: "Service Contract Under Review", completed: true, date: "04/03/2026" },
        { name: "Soil Data Collection", completed: true, date: "04/06/2026" },
        { name: "Analyst Team", completed: true, date: "04/10/2026" },
        { name: "Report Complete/Not Paid", completed: true, date: "04/14/2026" },
        { name: "Won", completed: true, date: "04/19/2026" },
      ],
    },
  },
  {
    key: "2",
    leadName: "David & Valier Appley",
    acres: "282 acres",
    submissionDate: "03/23/2026",
    stage: "Contact Info Only",
    stageColor: "purple",
    referralCode: "JSMITH2024",
    pipeline: "Soil Nutrient Load Pipeline",
    crmStage: "Inbound Contact Forms",
    dealStatus: "Open",
    contact: {
      name: "David & Valier Appley",
      email: "david.appley@example.com",
      phone: "(555) 555-5556",
    },
    progress: {
      stages: [
        { name: "Contact Form Submitted", completed: true, date: "03/23/2026" },
        { name: "Request for Services Submitted", completed: false, current: true },
        { name: "Agreement Sent", completed: false },
        { name: "Service Contract Under Review", completed: false },
        { name: "Soil Data Collection", completed: false },
        { name: "Analyst Team", completed: false },
        { name: "Report Complete/Not Paid", completed: false },
        { name: "Won", completed: false },
      ],
    },
  },
  {
    key: "3",
    leadName: "Steve L. Irlbeck",
    acres: "190 acres",
    submissionDate: "03/16/2026",
    stage: "Soil Sampling & Data Collection",
    stageColor: "orange",
    referralCode: "OTHER2024",
    pipeline: "Soil Nutrient Load Pipeline",
    crmStage: "RFS Qualified Paused",
    dealStatus: "Open",
    contact: {
      name: "Steve L. Irlbeck",
      email: "steve.irlbeck@example.com",
      phone: "(555) 555-5557",
    },
    progress: {
      stages: [
        { name: "Contact Form Submitted", completed: true, date: "03/16/2026" },
        { name: "Request for Services Submitted", completed: true, date: "03/18/2026" },
        { name: "Agreement Sent", completed: true, date: "03/25/2026" },
        { name: "Service Contract Under Review", completed: true, date: "04/02/2026" },
        { name: "Soil Data Collection", completed: true, current: true },
        { name: "Analyst Team", completed: false },
        { name: "Report Complete/Not Paid", completed: false },
        { name: "Won", completed: false },
      ],
    },
  },
  {
    key: "4",
    leadName: "Brian Fuller",
    acres: "316 acres",
    submissionDate: "02/28/2026",
    stage: "Invitation Sent",
    stageColor: "blue",
    referralCode: "JSMITH2024",
    pipeline: "Soil Nutrient Load Pipeline",
    crmStage: "Invitation Email",
    dealStatus: "Open",
    contact: {
      name: "Brian Fuller",
      email: "brian.fuller@example.com",
      phone: "(555) 555-5558",
    },
    progress: {
      stages: [
        { name: "Contact Form Submitted", completed: true, date: "02/28/2026" },
        { name: "Request for Services Submitted", completed: true, date: "03/05/2026" },
        { name: "Agreement Sent", completed: true, date: "03/15/2026" },
        { name: "Service Contract Under Review", completed: false, current: true },
        { name: "Soil Data Collection", completed: false },
        { name: "Analyst Team", completed: false },
        { name: "Report Complete/Not Paid", completed: false },
        { name: "Won", completed: false },
      ],
    },
  },
  {
    key: "5",
    leadName: "Jeff Nunn",
    acres: "148 acres",
    submissionDate: "02/09/2026",
    stage: "Contact Info Only",
    stageColor: "purple",
    referralCode: "OTHER2024",
    pipeline: "Soil Nutrient Load Pipeline",
    crmStage: "Inbound Calls",
    dealStatus: "Open",
    contact: {
      name: "Jeff Nunn",
      email: "jeff.nunn@example.com",
      phone: "(555) 555-5559",
    },
    progress: {
      stages: [
        { name: "Contact Form Submitted", completed: true, date: "02/09/2026" },
        { name: "Request for Services Submitted", completed: false, current: true },
        { name: "Agreement Sent", completed: false },
        { name: "Service Contract Under Review", completed: false },
        { name: "Soil Data Collection", completed: false },
        { name: "Analyst Team", completed: false },
        { name: "Report Complete/Not Paid", completed: false },
        { name: "Won", completed: false },
      ],
    },
  },
  // Lost deals mock data
  {
    key: "6",
    leadName: "Golden Valley Farms",
    acres: "100 acres",
    submissionDate: "04/05/2026",
    closedDate: addDays("04/05/2026", 3),
    stage: "Lost",
    stageColor: "red",
    lostReason: "Considering a Competitor",
    lostComment: "Producer is leaning toward an incumbent agronomist they already work with.",
    referralCode: "JSMITH2024",
    pipeline: "Soil Nutrient Load Pipeline",
    crmStage: "Contact Form Submitted",
    dealStatus: "Closed",
    contact: {
      name: "QA Team",
      email: "qa@example.com",
      phone: "(555) 555-5600",
    },
  },
  {
    key: "7",
    leadName: "Redwood Ridge Holdings",
    acres: "2 acres",
    submissionDate: "04/08/2026",
    closedDate: addDays("04/08/2026", 3),
    stage: "Lost",
    stageColor: "red",
    lostReason: "Unanswered Questions",
    lostComment: "Multiple follow-ups went unanswered so we never clarified program details.",
    referralCode: "OTHER2024",
    pipeline: "Soil Nutrient Load Pipeline",
    crmStage: "Contact Form Submitted",
    dealStatus: "Closed",
    contact: {
      name: "Unknown",
      email: "spam@example.com",
      phone: "(555) 555-5601",
    },
  },
  {
    key: "8",
    leadName: "Prairie Creek Co-op",
    acres: "245 acres",
    submissionDate: "04/12/2026",
    closedDate: addDays("04/12/2026", 3),
    stage: "Lost",
    stageColor: "red",
    lostReason: "Not Ready Now",
    lostComment: "Grower wants to revisit after harvest and paused the evaluation for now.",
    referralCode: "JSMITH2024",
    pipeline: "Soil Nutrient Load Pipeline",
    crmStage: "Contact Form Submitted",
    dealStatus: "Closed",
    contact: {
      name: "Clerk Office",
      email: "clerk@example.com",
      phone: "(555) 555-5602",
    },
  },
  {
    key: "9",
    leadName: "Silver Brook Agriculture",
    acres: "380 acres",
    submissionDate: "04/14/2026",
    closedDate: addDays("04/14/2026", 3),
    stage: "Lost",
    stageColor: "red",
    lostReason: "CPA Disagrees with Filing Request",
    lostComment: "External CPA recommended not filing because of conflicting depreciation schedules.",
    referralCode: "OTHER2024",
    pipeline: "Soil Nutrient Load Pipeline",
    crmStage: "Contact Form Submitted",
    dealStatus: "Closed",
    contact: {
      name: "Records Dept",
      email: "records@example.com",
      phone: "(555) 555-5603",
    },
  },
  {
    key: "12",
    leadName: "Maple Ridge Agronomy",
    acres: "410 acres",
    submissionDate: "04/15/2026",
    closedDate: addDays("04/15/2026", 3),
    stage: "Lost",
    stageColor: "red",
    lostReason: "Deal Idle for More Than 365 Days",
    lostComment: "No movement since last fall and the contact has been unresponsive for months.",
    referralCode: "JSMITH2024",
    pipeline: "Soil Nutrient Load Pipeline",
    crmStage: "Contact Form Submitted",
    dealStatus: "Closed",
    contact: {
      name: "Maya Ortiz",
      email: "maya.ortiz@mapleridge.com",
      phone: "(555) 555-5604",
    },
  },
  {
    key: "13",
    leadName: "Northwind Growers",
    acres: "150 acres",
    submissionDate: "04/16/2026",
    closedDate: addDays("04/16/2026", 3),
    stage: "Lost",
    stageColor: "red",
    lostReason: "Other",
    lostComment: "Team shifted budget toward irrigation upgrades so this project is on hold indefinitely.",
    referralCode: "OTHER2024",
    pipeline: "Soil Nutrient Load Pipeline",
    crmStage: "Contact Form Submitted",
    dealStatus: "Closed",
    contact: {
      name: "Blake Rivers",
      email: "brivers@northwindgrowers.com",
      phone: "(555) 555-5605",
    },
  },
]
