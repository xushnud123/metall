"use client";

import {Button} from "@/components/ui/button";
import {useGetOrders} from "@/hooks/use-get-orders";
import {useGetOrdersWithDemand} from "@/hooks/use-get-orders-with-demand";
import {RefreshCwIcon} from "lucide-react";
import {TableDemo} from "./table";

const List = () => {
  const {data, isLoading, refetch, isRefetching} = useGetOrders();
  const {data: ordersWithDemand, isLoading: ordersWithDemandLoading} =
    useGetOrdersWithDemand();

  if (isLoading || ordersWithDemand) return "Loading...";

  return (
    <div className="container">
      <Button
        size="sm"
        className="my-2 mt-4"
        onClick={async () => await refetch()}
      >
        <p className="mr-2">Yangilash </p>
        <RefreshCwIcon
          className={isRefetching ? `animate-spin w-4 h-4` : "w-4 h-4"}
        />
      </Button>
      <div className="mt-5">
        <TableDemo data={data!} ordersWithDemands={ordersWithDemand} />
      </div>
    </div>
  );
};

export default List;
