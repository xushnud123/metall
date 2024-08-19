"use client";

import { Button } from "@/components/ui/button";
import { useGetOrders } from "@/hooks/use-get-orders";
import { useGetOrdersWithDemand } from "@/hooks/use-get-orders-with-demand";
import { RefreshCwIcon } from "lucide-react";
import { TableDemo } from "./table";
import Image from "next/image";

const List = () => {
  const { data, isLoading, refetch, isRefetching } = useGetOrders();
  const { data: ordersWithDemand, isLoading: ordersWithDemandLoading } =
    useGetOrdersWithDemand();

  if (isLoading || ordersWithDemandLoading)
    return <div className="loader"></div>;

  const filteredData = data?.sort((a, b) => Number(a.code) - Number(b.code));

  return (
    <div className="container">
      <Button
        size="sm"
        className="my-2 mt-4 ml-auto"
        onClick={async () => await refetch()}
      >
        <p className="mr-2">Yangilash </p>
        <RefreshCwIcon
          className={isRefetching ? `animate-spin w-4 h-4` : "w-4 h-4"}
        />
      </Button>
      <div className="mt-5">
        {data?.length ? (
          <TableDemo
            data={filteredData!}
            ordersWithDemands={ordersWithDemand}
          />
        ) : (
          <div className="flex flex-col items-center justify-center mt-10">
            <Image
              src={"/not-found.png"}
              width={100}
              height={100}
              alt="Data not found"
            />
            <p className="text-lg text-white">Data Not Found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default List;
