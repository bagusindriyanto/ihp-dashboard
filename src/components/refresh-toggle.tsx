import { useIsFetching } from "@tanstack/react-query"
import { Button } from "./ui/button"
import { refreshData } from "@/lib/tanstack-query/refresh-data"
import { RefreshCwIcon } from "lucide-react"

export default function RefreshToggle() {
  const isFetching = useIsFetching()

  return (
    <Button
      aria-label="Refresh Data"
      variant="ghost"
      size="icon"
      disabled={!!isFetching}
      onClick={refreshData}
      title="Refresh Data"
    >
      <RefreshCwIcon className={isFetching ? "animate-spin" : ""} />
    </Button>
  )
}
