import React, { useEffect } from "react";
import ListItem from "./listItem";

interface TableProps {
  data: Order[];
  ordersWithDemands: { [key: string]: Array<string> };
}

export const TableDemo: React.FC<TableProps> = ({ data }) => {
  const [selectedProducts, setSelectedProducts] = React.useState<{
    [key: string]: string[];
  }>(
    localStorage.getItem("selectedProducts")
      ? JSON.parse(localStorage.getItem("selectedProducts") || "{}")
      : {}
  );

  return (
    <div>
      {data?.map((order) => {
        return <ListItem key={order.id} order={order} data={data} />;
      })}
    </div>
  );
};
