"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetCustomEntity = () => {
  return useQuery({
    queryKey: ["custom-entity"],
    queryFn: async () => {
      const { data } = await axios.get("/api/custom-entity");

      return data as any;
    },
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });
};
