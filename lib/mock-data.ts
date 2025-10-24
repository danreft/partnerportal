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

export const leadsData: LeadData[] = [
  {
    key: "1",
    leadName: "Roger Bohenkamp",
    acres: "1,020 acres",
    submissionDate: "10/01/2025",
    stage: "Invitation Sent",
    stageColor: "blue",
    contact: {
      name: "Roger Bohenkamp",
      email: "roger.bohenkamp@williamscompany.com",
      phone: "(555) 555-5555",
    },
    progress: {
      stages: [
        { name: "Contact Form Submitted", completed: true, date: "08/21/2025" },
        { name: "Request for Services Submitted", completed: true, date: "08/29/2025" },
        { name: "Agreement Sent", completed: true, date: "09/12/2025" },
        { name: "Service Contract Under Review", completed: true, current: true },
        { name: "Soil Data Collection", completed: false },
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
    submissionDate: "10/17/2025",
    closedDate: "10/17/2025", // date of the 'Won' stage
    stage: "Won",
    stageColor: "green",
    contact: {
      name: "Lena Hart",
      email: "lena.hart@greenvalley.com",
      phone: "(555) 555-5610",
    },
    progress: {
      stages: [
        { name: "Contact Form Submitted", completed: true, date: "09/12/2025" },
        { name: "Request for Services Submitted", completed: true, date: "09/18/2025" },
        { name: "Agreement Sent", completed: true, date: "09/22/2025" },
        { name: "Service Contract Under Review", completed: true, date: "09/28/2025" },
        { name: "Soil Data Collection", completed: true, date: "10/02/2025" },
        { name: "Analyst Team", completed: true, date: "10/08/2025" },
        { name: "Report Complete/Not Paid", completed: true, date: "10/12/2025" },
        { name: "Won", completed: true, date: "10/17/2025" },
      ],
    },
  },
  {
    key: "11",
    leadName: "Blue River Co-op",
    acres: "305 acres",
    submissionDate: "10/19/2025",
    closedDate: "10/19/2025", // date of the 'Won' stage
    stage: "Won",
    stageColor: "green",
    contact: {
      name: "Marcus Lee",
      email: "mlee@blueriver.coop",
      phone: "(555) 555-5611",
    },
    progress: {
      stages: [
        { name: "Contact Form Submitted", completed: true, date: "09/20/2025" },
        { name: "Request for Services Submitted", completed: true, date: "09/24/2025" },
        { name: "Agreement Sent", completed: true, date: "09/29/2025" },
        { name: "Service Contract Under Review", completed: true, date: "10/03/2025" },
        { name: "Soil Data Collection", completed: true, date: "10/06/2025" },
        { name: "Analyst Team", completed: true, date: "10/10/2025" },
        { name: "Report Complete/Not Paid", completed: true, date: "10/14/2025" },
        { name: "Won", completed: true, date: "10/19/2025" },
      ],
    },
  },
  {
    key: "2",
    leadName: "David & Valier Appley",
    acres: "282 acres",
    submissionDate: "09/23/2025",
    stage: "Contact Info Only",
    stageColor: "purple",
    contact: {
      name: "David & Valier Appley",
      email: "david.appley@example.com",
      phone: "(555) 555-5556",
    },
    progress: {
      stages: [
        { name: "Contact Form Submitted", completed: true, date: "09/23/2025" },
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
    submissionDate: "09/16/2025",
    stage: "Soil Sampling & Data Collection",
    stageColor: "orange",
    contact: {
      name: "Steve L. Irlbeck",
      email: "steve.irlbeck@example.com",
      phone: "(555) 555-5557",
    },
    progress: {
      stages: [
        { name: "Contact Form Submitted", completed: true, date: "09/16/2025" },
        { name: "Request for Services Submitted", completed: true, date: "09/18/2025" },
        { name: "Agreement Sent", completed: true, date: "09/25/2025" },
        { name: "Service Contract Under Review", completed: true, date: "10/02/2025" },
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
    submissionDate: "08/28/2025",
    stage: "Invitation Sent",
    stageColor: "blue",
    contact: {
      name: "Brian Fuller",
      email: "brian.fuller@example.com",
      phone: "(555) 555-5558",
    },
    progress: {
      stages: [
        { name: "Contact Form Submitted", completed: true, date: "08/28/2025" },
        { name: "Request for Services Submitted", completed: true, date: "09/05/2025" },
        { name: "Agreement Sent", completed: true, date: "09/15/2025" },
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
    submissionDate: "08/09/2025",
    stage: "Contact Info Only",
    stageColor: "purple",
    contact: {
      name: "Jeff Nunn",
      email: "jeff.nunn@example.com",
      phone: "(555) 555-5559",
    },
    progress: {
      stages: [
        { name: "Contact Form Submitted", completed: true, date: "08/09/2025" },
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
    submissionDate: "10/05/2025",
    closedDate: addDays("10/05/2025", 3),
    stage: "Lost",
    stageColor: "red",
    lostReason: "Internal Testing",
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
    submissionDate: "10/08/2025",
    closedDate: addDays("10/08/2025", 3),
    stage: "Lost",
    stageColor: "red",
    lostReason: "Spam",
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
    submissionDate: "10/12/2025",
    closedDate: addDays("10/12/2025", 3),
    stage: "Lost",
    stageColor: "red",
    lostReason: "Submitted by Mistake",
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
    submissionDate: "10/14/2025",
    closedDate: addDays("10/14/2025", 3),
    stage: "Lost",
    stageColor: "red",
    lostReason: "Split Submission",
    contact: {
      name: "Records Dept",
      email: "records@example.com",
      phone: "(555) 555-5603",
    },
  },
]
