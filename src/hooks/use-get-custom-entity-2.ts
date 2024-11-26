"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetCustomEntity2 = () => {
  return useQuery({
    queryKey: ["custom-entity-2"],
    queryFn: async () => {
      const { data } = await axios.get("/api/custom-entity-2");

      return data as any;
    },
    refetchInterval: false,
    refetchOnWindowFocus: false,
  });
};
