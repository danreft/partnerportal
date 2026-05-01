"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AuthGuard } from "@/components/auth-guard"
import { ReferralsView } from "@/components/referrals-view"

export default function ManagerReferralsPage() {
  return (
    <AuthGuard role="manager">
      <div className="flex min-h-screen flex-col bg-gray-50">
        <Header />
        <ReferralsView />
        <Footer />
      </div>
    </AuthGuard>
  )
}
