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
