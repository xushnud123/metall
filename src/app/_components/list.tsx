"use client";

import { useGetOrders } from "@/hooks/use-get-orders";
import { useGetOrdersWithDemand } from "@/hooks/use-get-orders-with-demand";
import { TableDemo } from "./table";
import Image from "next/image";
import { StringParam, useQueryParams, withDefault } from "use-query-params";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const List = () => {
  const [filterData, setFilterData] = useState<Order[]>();
  const { data, isLoading } = useGetOrders();
  const [query] = useQueryParams({
    name: withDefault(StringParam, "all", true),
    warehouse: withDefault(StringParam, "all", true),
  });
  const client = useQueryClient();

  const { data: ordersWithDemand, isLoading: ordersWithDemandLoading } =
    useGetOrdersWithDemand();

  useEffect(() => {
    const warehouses: any = client.getQueryData(["WAREHOUSES"]);
    const warehousesData = warehouses?.rows.filter(
      (item: any) => item.name === query.warehouse
    );

    if (data && query.name !== "0") {
      let filtData: any[] = [];

      if (query.name !== "all") {
        data.forEach((order) => {
          const element = order.attributes.filter(
            (item: any) => item.id === "bf6c8db4-4807-11ef-0a80-037f00392b45"
          );
          if (element[0]?.value?.name === query.name) {
            filtData.push(order);
          }
        });
      }

      if (query.warehouse !== "all") {
        if (warehousesData.length > 0 && filtData?.length > 0) {
          const warehousesFilter = filtData?.filter(
            (item) => item?.meta.href === warehousesData[0].store.meta.href
          );
          filtData = warehousesFilter;
        } else {
          const warehousesFilter = data?.filter(
            (item) => item?.store.meta.href === warehousesData[0].meta.href
          );
          console.log("data===", warehousesFilter);
          filtData = warehousesFilter;
        }
      }

      if (query.name === "all" && query.warehouse === "all") {
        setFilterData(data?.sort((a, b) => Number(a.code) - Number(b.code)));
      } else {
        setFilterData(
          filtData?.sort((a, b) => Number(a.code) - Number(b.code))
        );
      }
    }
  }, [query, isLoading]);

  if (isLoading || ordersWithDemandLoading)
    return <div className='loader'></div>;

  // const filteredData = data?.sort((a, b) => Number(a.code) - Number(b.code));

  return (
    <div className='container'>
      <div className='mt-5'>
        {filterData && filterData?.length > 0 ? (
          <TableDemo data={filterData!} ordersWithDemands={ordersWithDemand} />
        ) : (
          <div className='flex flex-col items-center justify-center mt-10'>
            <Image
              src={"/not-found.png"}
              width={100}
              height={100}
              alt='Data not found'
            />
            <p className='text-lg text-white'>Data Not Found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default List;
