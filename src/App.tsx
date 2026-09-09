import AppSidebar from "@/components/shadcn-space/blocks/dashboard-shell-01/app-sidebar"
import StatisticsBlock from "@/components/shadcn-space/blocks/dashboard-shell-01/statistics"
import SalesOverviewChart from "@/components/shadcn-space/blocks/dashboard-shell-01/sales-overview-chart"
import EarningReportChart from "@/components/shadcn-space/blocks/dashboard-shell-01/earning-report-chart"
import SalesByCountryWidget from "@/components/shadcn-space/blocks/dashboard-shell-01/salesbycountrywidget"
import TopProductTable from "@/components/shadcn-space/blocks/dashboard-shell-01/top-product-table"

export function App() {
  return (
    <AppSidebar>
      <div className="flex flex-1 flex-col gap-6 p-6">
        <StatisticsBlock />
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-8">
            <SalesOverviewChart />
          </div>
          <div className="col-span-12 xl:col-span-4">
            <EarningReportChart />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-4">
            <SalesByCountryWidget />
          </div>
          <div className="col-span-12 xl:col-span-8">
            <TopProductTable />
          </div>
        </div>
      </div>
    </AppSidebar>
  )
}

export default App
