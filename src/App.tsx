import { Route, Routes } from "react-router"
import AppSidebar from "@/components/shadcn-space/blocks/dashboard-shell-01/app-sidebar"
import AnalyticsDashboard from "@/pages/AnalyticsDashboard"
import CRMDashboard from "@/pages/CRMDashboard"

export default function App() {
  return (
    <AppSidebar>
      <Routes>
        <Route path="/" element={<AnalyticsDashboard />} />
        <Route path="/crm" element={<CRMDashboard />} />
      </Routes>
    </AppSidebar>
  )
}
