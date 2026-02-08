import { useQuery } from "@tanstack/react-query";
import { getUserOrders } from "../requests/wildberries";

export const ORDERS_KEY = ["orders"];

export function useOrders(skip: number, take: number) {
  return useQuery({
    queryKey: [...ORDERS_KEY, skip, take],
    queryFn: () => getUserOrders(skip, take),
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}
