"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AuthGuard } from "@/components/auth-guard"
import { ReferralsView } from "@/components/referrals-view"
import { useUser } from "@/components/user-context"

export default function ManagerReferralsPage() {
  const { user, viewMode } = useUser()
  const filterReferralCode = viewMode === "self" ? user?.referralCode : undefined

  return (
    <AuthGuard role="manager">
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header />
        <ReferralsView filterReferralCode={filterReferralCode} />
        <Footer />
      </div>
    </AuthGuard>
  )
}
