import React, { useEffect } from "react";
import ListItem from "./listItem";

interface TableProps {
  data: Order[];
  ordersWithDemands: { [key: string]: Array<string> };
}

export const TableDemo: React.FC<TableProps> = ({
  data,
  ordersWithDemands,
}) => {
  const [selectedProducts, setSelectedProducts] = React.useState<{
    [key: string]: string[];
  }>(
    localStorage.getItem("selectedProducts")
      ? JSON.parse(localStorage.getItem("selectedProducts") || "{}")
      : {}
  );

  useEffect(() => {
    if (ordersWithDemands) mergeDemands(ordersWithDemands);
  }, [ordersWithDemands]);

  useEffect(() => {
    console.log("selectedProducts", selectedProducts);
  }, [selectedProducts]);

  useEffect(() => {
    localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
  }, [selectedProducts]);

  const mergeDemands = (demands: { [key: string]: string[] }) => {
    setSelectedProducts((prevSelectedProducts) => {
      const merged = { ...prevSelectedProducts };

      Object.entries(demands).forEach(([key, value]) => {
        if (!merged[key]) {
          merged[key] = [];
        }
        merged[key] = Array.from(new Set([...merged[key], ...value]));
      });

      return merged;
    });
  };

  return (
    <div>
      {data.map((order) => {
        return (
          <ListItem
            key={order.id}
            order={order}
            data={data}
            // selectedProducts={selectedProducts}
            // setSelectedProducts={setSelectedProducts}
          />
        );
      })}
    </div>
  );
};
