import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
/* eslint-disable @next/next/no-img-element */
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCustomEntity } from "@/hooks/use-get-custom-entity";
import { useGetCustomEntity2 } from "@/hooks/use-get-custom-entity-2";
import { CHECK_NUMBER_ID, COMMENT_PRO_ID } from "@/lib/env";

interface ListItemProps {
  order: Order;
  data: Order[];
  setSelectedProducts: (val: { [key: string]: string[] }) => void;
  selectedProducts: {
    [key: string]: string[];
  };
}

type Comments = {
  [key: string]: string;
};

const ListItem = ({
  order,
  data,
  selectedProducts,
  setSelectedProducts,
}: ListItemProps) => {
  const [open, setOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState("");

  const [errors, setErrors] = useState({
    entityId: false,
    entityId2: false,
  });

  const { data: customEntityData, isLoading } = useGetCustomEntity();
  const { data: customEntityData2, isLoading: isLoading2 } =
    useGetCustomEntity2();

  const [entityId, setEntityId] = useState("");
  const [entityId2, setEntityId2] = useState("");

  const checkNumber = order.attributes.filter(
    (item: Attributes) => item.id === CHECK_NUMBER_ID
  )[0]?.value;
  const commentPro = order.attributes.filter(
    (item: Attributes) => item.id === COMMENT_PRO_ID
  )[0]?.value;

  useEffect(() => {
    const selectedEntity = customEntityData?.rows?.filter(
      (entity: any) => entity?.name === order?.attributes?.[0]?.value?.name
    )[0]?.id;
    const selectedEntity2 = customEntityData2?.rows
      ?.sort((a: { name: number }, b: { name: number }) => a.name - b.name)
      .filter(
        (entity: any) => entity?.name === order?.attributes?.[1]?.value?.name
      )[0]?.id;

    setEntityId(selectedEntity);
    setEntityId2(selectedEntity2);
  }, [customEntityData, order, customEntityData2]);
  const [comments, setComments] = useState<Comments>({});

  const handleOpenModal = (orderId: string) => {
    const newErrors = {
      entityId: !entityId || entityId === "0",
      entityId2: !entityId2 || entityId2 === "0",
    };
    setErrors(newErrors);

    if (!entityId || !entityId2 || entityId === "0" || entityId2 === "0") {
      setTimeout(() => {
        setErrors({ entityId: false, entityId2: false });
      }, 3000);
      return;
    }

    if (entityId && entityId2) {
      setCurrentOrderId(orderId);
      setOpen(true);
    }
  };

  const onConfirm = async () => {
    const currentOrder = data.filter(
      (order) => order.id === currentOrderId
    )?.[0];

    const entityObj = customEntityData.rows.filter(
      (en: any) => en.id === entityId
    )[0];
    const entityObj2 = customEntityData2.rows.filter(
      (en: any) => en.id === entityId2
    )[0];

    const putPayload: any = {
      id: currentOrder.id,
      name: currentOrder.code,
      externalCode: currentOrder.externalCode,
      moment: currentOrder.moment,
      code: currentOrder.mainCode,
      applicable: currentOrder.applicable,
      vatEnabled: currentOrder.vatEnabled,
      vatIncluded: currentOrder.vatIncluded,
      agent: { meta: currentOrder.agent_meta },
      // agentAccount: currentOrder.agentAccount_meta,
      state: { meta: currentOrder.state_meta },
      description: comments[currentOrder.id],
    };

    const attributes = [];

    // Add the first attribute if entityObj is not empty
    if (entityObj && Object.keys(entityObj).length > 0) {
      attributes.push({
        meta: {
          href: "https://api.moysklad.ru/api/remap/1.2/entity/customerorder/metadata/attributes/bf6c8db4-4807-11ef-0a80-037f00392b45",
          type: "attributemetadata",
          mediaType: "application/json",
        },
        id: "bf6c8db4-4807-11ef-0a80-037f00392b45",
        name: "Кто отгрузил",
        type: "customentity",
        value: {
          meta: entityObj.meta,
          name: entityObj.name,
        },
      });
    }

    // Add the second attribute if entityObj2 is not empty
    if (entityObj2 && Object.keys(entityObj2).length > 0) {
      attributes.push({
        meta: {
          href: "https://api.moysklad.ru/api/remap/1.2/entity/customerorder/metadata/attributes/cc481563-4807-11ef-0a80-0bea00359633",
          type: "attributemetadata",
          mediaType: "application/json",
        },
        id: "cc481563-4807-11ef-0a80-0bea00359633",
        name: "Бригада",
        type: "customentity",
        value: {
          meta: entityObj2.meta,
          name: entityObj2.name,
        },
      });
    }

    // Only add the attributes key if there are attributes to add
    if (attributes.length > 0) {
      putPayload.attributes = attributes;
    }

    console.log("putPayload: ", JSON.stringify(putPayload, null, 2));

    console.log("putPayload: ", JSON.stringify(putPayload, null, 2));

    const payload = {
      orderId: currentOrder.id,
      organization: { meta: currentOrder.organization_meta },
      agent: { meta: currentOrder.agent_meta },
      store: currentOrder.store,
      rate: currentOrder.rate,
      customerOrder: {
        meta: {
          href: currentOrder.meta.href,
          type: currentOrder.meta.type,
          mediaType: currentOrder.meta.mediaType,
          uuidHref: currentOrder.meta.uuidHref,
        },
      },
      positions: currentOrder.products
        .filter((product) =>
          selectedProducts?.[currentOrder?.id]?.includes(product?.id)
        )
        .map((product) => {
          return {
            quantity: product.quantity,
            price: product.price,
            discount: product.discount,
            vat: product.vat,
            assortment: {
              meta: product.assortment.meta,
            },
          };
        }),
    };

    try {
      const data = Promise.all([
        await axios.post("/api/orders", {
          ...payload,
        }),
        await axios.put("/api/orders", putPayload),
      ]);

      setOpen(false);

      console.log("data: ", data);
    } catch (err: any) {
      console.log("error: ", err);
    }

    console.log("payload: ", payload);
  };

  const handleSelect = (orderId: string, productId: string) => {
    if (selectedProducts[orderId]?.includes(productId)) {
      setSelectedProducts({
        ...selectedProducts,
        [orderId]: selectedProducts[orderId].filter(
          (product) => product !== productId
        ),
      });
    } else {
      const newSelectedProducts = {
        ...selectedProducts,
        [orderId]: selectedProducts[orderId]
          ? [...selectedProducts[orderId], productId]
          : [productId],
      };
      setSelectedProducts(newSelectedProducts);
    }
  };

  const date = new Date(order.moment);

  const formattedDate = format(date, "dd.MM.yyyy");

  return (
    <div className="my-5 rounded-md border border-primary p-y">
      <Dialog open={open} setOpen={setOpen} onConfirm={onConfirm} />

      <div className="flex flex-col w-full mb-5">
        {checkNumber && (
          <h2 className="px-5 py-2 text-center text-2xl bg-primary text-white">
            {checkNumber}
          </h2>
        )}
        <div className="p-5">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-xs capitalize">{order.agent_name}</h4>
            <p className="text-xs ml-auto">{order.phone}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs">{order.code}</p>
            <p className="text-xs">{formattedDate}</p>
          </div>
        </div>
        <div className="w-full px-5 flex gap-5">
          <select
            onChange={(e) => setEntityId(e.target.value)}
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
              errors.entityId ? "!border-1 !border-red-600" : ""
            }`}
          >
            <option selected value="0">
              {isLoading ? "Loading..." : `Кто отгрузил`}
            </option>
            {customEntityData?.rows?.map((entity: any) => (
              <option className="text-sm" key={entity.id} value={entity.id}>
                {entity.name}
              </option>
            ))}
          </select>

          {/* <Select value={entityId} onValueChange={(e) => setEntityId(e)}>
            <SelectTrigger
              className={`w-full ${
                errors.entityId ? "border-2 border-red-600" : ""
              }`}
            >
              <SelectValue
                placeholder={isLoading ? "Loading..." : `Кто отгрузил`}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Кто отгрузил</SelectItem>
              {customEntityData?.rows?.map((entity: any) => (
                <SelectItem key={entity.id} value={entity.id}>
                  {entity.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}

          <select
            onChange={(e) => setEntityId2(e.target.value)}
            className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
              errors.entityId ? "!border-1 !border-red-600" : ""
            }`}
          >
            <option selected value="0">
              {isLoading ? "Loading..." : `Бригада`}
            </option>
            {customEntityData2?.rows?.map((entity: any) => (
              <option className="text-xl" key={entity.id} value={entity.id}>
                {entity.name}
              </option>
            ))}
          </select>

          {/* <Select value={entityId2} onValueChange={(e) => setEntityId2(e)}>
            <SelectTrigger
              className={`w-full ${
                errors.entityId2 ? "border-2 border-red-600" : ""
              }`}
            >
              <SelectValue
                placeholder={isLoading2 ? "Loading..." : `Бригада`}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Бригада</SelectItem>
              {customEntityData2?.rows?.map((entity: any) => (
                <SelectItem key={entity.id} value={entity.id}>
                  {entity.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}
        </div>
      </div>

      <div>
        <Table className="rounded-xl border-zinc-100">
          <TableHeader>
            <TableRow className="border-t  font-bold">
              <TableHead className="w-1/2">Tovar Nomi</TableHead>
              <TableHead>Soni</TableHead>
              <TableHead>Yuklandi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  <span>{product.quantity}</span>
                </TableCell>
                <TableCell>
                  <Checkbox
                    className="block mx-auto"
                    checked={selectedProducts?.[order.id]?.includes(product.id)}
                    onClick={() => handleSelect(order.id, product.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            {commentPro && (
              <TableRow>
                <TableCell className="text-xs pt-5" colSpan={3}>
                  {commentPro.split("\n").map((item: string) => (
                    <p key={item}>{item}</p>
                  ))}
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell colSpan={3}>
                <textarea
                  value={
                    comments[order.id] !== undefined
                      ? comments[order.id]
                      : order.description
                      ? order.description
                      : ""
                  }
                  className="w-full p-2 resize-none bg-secondary rounded"
                  placeholder="Comment"
                  onChange={(e) => {
                    if (!order.description) {
                      setComments({
                        ...comments,
                        [order.id]: e.target.value,
                      });
                    } else {
                      setComments({
                        ...comments,
                        [order.id]: e.target.value,
                      });
                    }
                  }}
                ></textarea>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3} className="text-right">
                <Button
                  size="sm"
                  className="w-full"
                  style={{ background: "#FF4B68", color: "white" }}
                  onClick={() => handleOpenModal(order.id)}
                >
                  Yuborish
                </Button>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default ListItem;

const Dialog = ({
  open,
  setOpen,
  onConfirm,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onConfirm: () => void;
}) => {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Ma&apos;lumotlar yuborishni tasdiqlaysizmi?
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Bekor qilish
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Tasdiqlayman
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
