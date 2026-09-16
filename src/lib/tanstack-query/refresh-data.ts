import { queryClient } from "./query-client"

export const refreshData = () => {
  queryClient.invalidateQueries()
}
