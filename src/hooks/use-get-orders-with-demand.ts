"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetOrdersWithDemand = () => {
  return useQuery({
    queryKey: ["orders-with-demands"],
    queryFn: async () => {
      const { data } = await axios.get("/api/demands");

      return data.data as any;
    },
  });
};
