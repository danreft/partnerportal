export type UserRole = "partner" | "manager"

export interface AppUser {
  id: string
  name: string
  email: string
  role: UserRole
  referralCode?: string
  title: string
  avatarColor: string
  initials: string
}

export const MOCK_USERS: AppUser[] = [
  {
    id: "john-smith",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "partner",
    referralCode: "JSMITH2024",
    title: "Referral Partner",
    avatarColor: "#4a9d6f",
    initials: "JS",
  },
  {
    id: "emily-carter",
    name: "Emily Carter",
    email: "emily.carter@example.com",
    role: "partner",
    referralCode: "OTHER2024",
    title: "Referral Partner",
    avatarColor: "#6366f1",
    initials: "EC",
  },
  {
    id: "sarah-johnson",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "manager",
    referralCode: "SJOHNSON2024",
    title: "Referral Team Manager",
    avatarColor: "#0369a1",
    initials: "SJ",
  },
]
