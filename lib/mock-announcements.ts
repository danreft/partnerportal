export type AnnouncementType = "Webinar" | "Newsletter" | "Deadline" | "Update" | "Reminder"

export interface Announcement {
  id: number
  type: AnnouncementType
  title: string
  date: string
  body: string
}

export const announcementTagColor: Record<AnnouncementType, string> = {
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
  },
  {
    id: 2,
    type: "Deadline",
    title: "Q2 Referral Submission Deadline",
    date: "June 30, 2026",
    body: "All Q2 referral submissions must be entered into the portal by end of day. Contact your account manager with any questions.",
  },
  {
    id: 3,
    type: "Newsletter",
    title: "May Partner Newsletter",
    date: "May 1, 2026",
    body: "This month covers new partnership incentives, updated service pricing, regional market insights, and a spotlight on top-performing partners.",
  },
  {
    id: 4,
    type: "Update",
    title: "New Soil Report Format",
    date: "April 20, 2026",
    body: "We've refreshed the soil analysis report layout for improved readability. All new reports generated after May 1st will use the updated format.",
  },
  {
    id: 5,
    type: "Reminder",
    title: "Complete Your Partner Profile",
    date: "April 10, 2026",
    body: "Please ensure your referral partner profile is up to date, including your preferred contact method and service region, to avoid delays.",
  },
  {
    id: 6,
    type: "Webinar",
    title: "Referral Program Best Practices",
    date: "March 28, 2026",
    body: "A recording of last month's best practices webinar is now available. Learn tips for converting leads faster and maximizing your referral revenue.",
  },
]
