import { useQuery } from "@tanstack/react-query"
import { fetchManPower } from "./man-power.api"

export const useFetchManPower = () =>
  useQuery({
    queryKey: ["man-power"],
    queryFn: fetchManPower,
  })
