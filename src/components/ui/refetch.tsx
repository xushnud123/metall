"use client";
import React from "react";
import { Button } from "./button";
import { RefreshCwIcon } from "lucide-react";
import { useGetOrders } from "@/hooks/use-get-orders";

const RefetchButton = () => {
  const { refetch, isRefetching } = useGetOrders();
  return (
    <Button
      size="sm"
      className="w-20"
      variant={"secondary"}
      onClick={async () => await refetch()}
    >
      <RefreshCwIcon
        className={isRefetching ? `animate-spin w-4 h-4` : "w-4 h-4"}
      />
    </Button>
  );
};

export default RefetchButton;
