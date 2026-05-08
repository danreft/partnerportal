export type AnnouncementType = "General" | "Webinar" | "Newsletter" | "Deadline" | "Update" | "Reminder"

export interface AnnouncementDetail {
  label: string
  value: string
}

export interface AnnouncementLink {
  label: string
  url: string
}

export interface Announcement {
  id: number
  type: AnnouncementType
  title: string
  date: string
  body: string
  fullBody: string
  details?: AnnouncementDetail[]
  links?: AnnouncementLink[]
  imageUrl?: string
}

export const announcementTagColor: Record<AnnouncementType, string> = {
  General: "default",
  Webinar: "blue",
  Newsletter: "purple",
  Deadline: "error",
  Update: "success",
  Reminder: "warning",
}

export const announcements: Announcement[] = [
  {
    id: 1,
    type: "Webinar",
    title: "Spring Soil Health Webinar",
    date: "May 15, 2026",
    body: "Join us for an in-depth session on soil nutrient management strategies for the upcoming growing season. Registration link will be sent via email.",
    fullBody:
      "We're excited to invite all Referral Partners to our upcoming Spring Soil Health Webinar. This session will be led by our senior agronomists and will cover the latest research in soil nutrient management, cover crop strategies, and how to communicate soil health value to your clients.\n\nWhether you're new to the program or a seasoned partner, this webinar will give you practical talking points and tools to help convert more referrals during the spring season.\n\nA calendar invite and Zoom link will be sent to your registered email address 48 hours before the event. A recording will be available afterward for those who cannot attend live.",
    details: [
      { label: "Date", value: "May 15, 2026" },
      { label: "Time", value: "2:00 PM – 3:30 PM CST" },
      { label: "Format", value: "Live Zoom Webinar" },
      { label: "Host", value: "Boa Safra Ag Agronomy Team" },
    ],
    links: [
      { label: "Register Now", url: "https://boasafraag.com" },
      { label: "Add to Calendar", url: "https://boasafraag.com" },
    ],
  },
  {
    id: 2,
    type: "Deadline",
    title: "Q2 Referral Submission Deadline",
    date: "June 30, 2026",
    body: "All Q2 referral submissions must be entered into the portal by end of day. Contact your account manager with any questions.",
    fullBody:
      "This is a reminder that the Q2 referral submission deadline is June 30, 2026 at 11:59 PM CST. Any leads submitted after this date will be counted toward Q3 for incentive and reporting purposes.\n\nTo ensure your referrals are counted for this quarter, please make sure all contact information is complete and the lead status has been updated in the portal. Incomplete submissions may be delayed or disqualified from Q2 incentives.\n\nIf you have any questions about your current submissions or need assistance, please reach out to your account manager directly or use the Meeting Request form in the Resources section.",
    details: [
      { label: "Deadline", value: "June 30, 2026 at 11:59 PM CST" },
      { label: "Applies To", value: "All referrals submitted April 1 – June 30" },
      { label: "Incentive Period", value: "Q2 2026" },
    ],
    links: [
      { label: "Submit a Referral", url: "https://boasafraag.com" },
      { label: "Contact Your Account Manager", url: "https://boasafraag.com" },
    ],
  },
  {
    id: 3,
    type: "Newsletter",
    title: "May Partner Newsletter",
    date: "May 1, 2026",
    body: "This month covers new partnership incentives, updated service pricing, regional market insights, and a spotlight on top-performing partners.",
    fullBody:
      "Welcome to the May 2026 Partner Newsletter. Here's what's inside this month:\n\n**New Partnership Incentives**\nStarting June 1st, partners who refer 5 or more qualified leads per quarter will unlock a Platinum tier bonus. Details on the updated incentive structure are available from your account manager.\n\n**Updated Service Pricing**\nOur soil analysis service pricing has been updated to reflect current lab costs. The new pricing takes effect on May 15th and applies to all new service agreements. Existing agreements are not affected.\n\n**Regional Market Insights**\nSpring planting is underway across the Midwest and South. Demand for soil nutrient load analysis is up 22% year-over-year. This is an ideal time to connect with growers who are preparing for summer crops.\n\n**Partner Spotlight**\nThis month we're recognizing John Smith for outstanding referral performance in Q1 2026. John contributed 8 qualified referrals, including 3 closed deals totaling over 900 acres.",
    details: [
      { label: "Issue", value: "May 2026" },
      { label: "Published", value: "May 1, 2026" },
    ],
    links: [
      { label: "View Full Newsletter (PDF)", url: "https://boasafraag.com" },
      { label: "View Incentive Structure", url: "https://boasafraag.com" },
    ],
  },
  {
    id: 4,
    type: "Update",
    title: "New Soil Report Format",
    date: "April 20, 2026",
    body: "We've refreshed the soil analysis report layout for improved readability. All new reports generated after May 1st will use the updated format.",
    fullBody:
      "We've made significant improvements to our soil analysis report format based on partner and client feedback. The new layout is cleaner, easier to read, and includes several new sections that better communicate actionable insights to growers.\n\nKey changes in the new format include:\n\n• Simplified executive summary on page 1 with key nutrient findings\n• Color-coded nutrient status indicators (optimal, low, deficient)\n• Side-by-side field comparison when multiple samples are submitted\n• Recommended amendment rates displayed prominently\n• Updated Boa Safra Ag branding throughout\n\nAll reports generated on or after May 1, 2026 will automatically use the new format. Reports generated prior to this date will retain the original layout. If you have clients who need a refreshed version of an older report, please contact your account manager.",
    details: [
      { label: "Effective Date", value: "May 1, 2026" },
      { label: "Applies To", value: "All new soil analysis reports" },
    ],
    links: [
      { label: "View Sample Report", url: "https://boasafraag.com" },
    ],
  },
  {
    id: 5,
    type: "Reminder",
    title: "Complete Your Partner Profile",
    date: "April 10, 2026",
    body: "Please ensure your referral partner profile is up to date, including your preferred contact method and service region, to avoid delays.",
    fullBody:
      "We're doing a spring cleanup of our partner records and want to make sure your profile is accurate and complete. An up-to-date profile helps us route leads correctly, send you relevant communications, and ensure you're credited for the right service regions.\n\nPlease review and update the following in your profile:\n\n• Preferred contact method (email, phone, or both)\n• Service region(s) you actively cover\n• Mailing address for collateral and incentive payments\n• Emergency or backup contact information\n\nProfiles that are incomplete after May 1, 2026 may experience delays in lead routing and incentive payouts. If you have trouble updating your profile or need assistance, contact our partner support team.",
    details: [
      { label: "Action Required By", value: "May 1, 2026" },
      { label: "Who Is Affected", value: "All active Referral Partners" },
    ],
    links: [
      { label: "Update Your Profile", url: "https://boasafraag.com" },
      { label: "Contact Partner Support", url: "https://boasafraag.com" },
    ],
  },
  {
    id: 6,
    type: "Webinar",
    title: "Referral Program Best Practices",
    date: "March 28, 2026",
    body: "A recording of last month's best practices webinar is now available. Learn tips for converting leads faster and maximizing your referral revenue.",
    fullBody:
      "Thank you to everyone who joined our Referral Program Best Practices webinar on March 28th. The recording is now available for all partners to watch at their convenience.\n\nThis session covered:\n\n• How to identify and qualify strong referral candidates\n• The most effective ways to introduce Boa Safra Ag's services to growers\n• Common objections and how to respond to them\n• How to use the partner portal to track your leads and stay organized\n• Tips from top-performing partners on building long-term client relationships\n\nThe webinar ran approximately 75 minutes and includes a Q&A segment. We recommend watching the full recording if you were unable to attend, as the Q&A contains several practical insights from other partners.",
    details: [
      { label: "Originally Held", value: "March 28, 2026" },
      { label: "Recording Length", value: "~75 minutes" },
      { label: "Format", value: "On-Demand Video" },
    ],
    links: [
      { label: "Watch the Recording", url: "https://boasafraag.com" },
      { label: "Download Slide Deck", url: "https://boasafraag.com" },
    ],
  },
]
