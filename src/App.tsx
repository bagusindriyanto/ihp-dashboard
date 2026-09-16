import { Route, Routes } from "react-router"
import AppSidebar from "@/components/shadcn-space/blocks/dashboard-shell-01/app-sidebar"
import AnalyticsDashboard from "@/pages/analytics-dashboard"
import CRMDashboard from "@/pages/crm-dashboard"
import ManPowerDashboard from "@/pages/man-power-dashboard"

export default function App() {
  return (
    <AppSidebar>
      <Routes>
        <Route path="/" element={<AnalyticsDashboard />} />
        <Route path="/crm" element={<CRMDashboard />} />
        <Route path="/man-power" element={<ManPowerDashboard />} />
      </Routes>
    </AppSidebar>
  )
}
