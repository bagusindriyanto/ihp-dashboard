import { Route, Routes } from "react-router"
import AppSidebar from "@/components/shadcn-space/blocks/dashboard-shell-01/app-sidebar"
import AnalyticsDashboard from "@/pages/analytics-dashboard"
import CRMDashboard from "@/pages/crm-dashboard"
import ManPowerDashboard from "@/pages/man-power-dashboard"
import AllTargetDashboard from "@/pages/all-target-dashboard"
import OutputPrintingDashboard from "@/pages/output-printing-dashboard"
import OutputTPRDashboard from "@/pages/output-tpr-dashboard"
import OutputDirbonDashboard from "@/pages/output-dirbon-dashboard"

export default function App() {
  return (
    <AppSidebar>
      <Routes>
        <Route path="/" element={<AnalyticsDashboard />} />
        <Route path="/crm" element={<CRMDashboard />} />
        <Route path="/man-power" element={<ManPowerDashboard />} />
        <Route path="/all-target" element={<AllTargetDashboard />} />
        <Route path="/output-printing" element={<OutputPrintingDashboard />} />
        <Route path="/output-tpr" element={<OutputTPRDashboard />} />
        <Route path="/output-dirbon" element={<OutputDirbonDashboard />} />
      </Routes>
    </AppSidebar>
  )
}
