import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { format } from "date-fns";
import * as Toast from "@radix-ui/react-toast";
import * as Select from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cross1Icon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";

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
import { useGetOrders } from "@/hooks/use-get-orders";
import { cn } from "@/lib/utils";

interface ListItemProps {
  order: Order;
  data: Order[];
}

type Comments = {
  [key: string]: string;
};

const ListItem = ({ order, data }: ListItemProps) => {
  const [selectedProducts, setSelectedProducts] = useState<any>(
    order.products
      .filter((item) => item.quantity === item.shipped)
      .map((item) => item.id)
  );

  const [open, setOpen] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState("");
  const eventDateRef = React.useRef(new Date());
  const timerRef = React.useRef(0);
  const { refetch } = useGetOrders();

  React.useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const [errors, setErrors] = useState({
    entityId: false,
    entityId2: false,
  });

  const { data: customEntityData } = useGetCustomEntity();
  const { data: customEntityData2 } = useGetCustomEntity2();
  const [comments, setComments] = useState<Comments>({});

  const [entityId, setEntityId] = useState("");
  const [entityId2, setEntityId2] = useState("");

  const checkNumber = order.attributes.filter(
    (item: Attributes) => item.id === CHECK_NUMBER_ID
  )[0]?.value;
  const commentPro = order.attributes.filter(
    (item: Attributes) => item.id === COMMENT_PRO_ID
  )[0]?.value;

  useEffect(() => {
    const name = order.attributes.filter(
      (item: any) => item.id === "bf6c8db4-4807-11ef-0a80-037f00392b45"
    )[0]?.value?.name;
    const name2 = order.attributes.filter(
      (item: any) => item.id === "cc481563-4807-11ef-0a80-0bea00359633"
    )[0]?.value?.name;

    setEntityId(
      customEntityData?.rows?.filter((item: any) => item.name === name)[0]?.id
    );
    setEntityId2(
      customEntityData2?.rows?.filter((item: any) => item.name === name2)[0]?.id
    );
  }, [customEntityData, order, customEntityData2]);

  function oneWeekAway() {
    const now = new Date();
    const inOneWeek = now.setDate(now.getDate() + 7);
    return new Date(inOneWeek);
  }

  const handleOpenModal = (orderId: string) => {
    const newErrors = {
      entityId: !entityId || entityId === "0",
      entityId2: !entityId2 || entityId2 === "0",
    };

    if (!entityId || !entityId2 || entityId === "0" || entityId2 === "0") {
      setOpenToast(false);
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        eventDateRef.current = oneWeekAway();
        setOpenToast(true);
      }, 100);

      setErrors(newErrors);
    } else if (entityId && entityId2) {
      setCurrentOrderId(orderId);
      setOpen(true);
      refetch();
      setErrors({
        entityId: false,
        entityId2: false,
      });
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

    const positions = [
      ...order.products
        .filter((item) => selectedProducts.includes(item.id))
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
    ].filter((item) => item !== null);

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
      positions,
    };

    console.log("payload ===", putPayload);
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
  };

  const date = new Date(order.moment);

  const formattedDate = format(date, "dd.MM.yyyy");

  const toggleId = (id: string) => {
    setSelectedProducts((prev: string[]) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className='my-5 rounded-md border border-primary p-y overflow-hidden'>
      <Dialog open={open} setOpen={setOpen} onConfirm={onConfirm} />

      <div className='flex flex-col w-full mb-5'>
        {checkNumber && (
          <h2 className='px-5 py-2 text-center text-2xl bg-primary text-white'>
            {checkNumber}
          </h2>
        )}
        <div className='p-5'>
          <div className='flex items-center justify-between mb-1'>
            <h4 className='text-xs capitalize'>{order.agent_name}</h4>
            {/* <p className='text-xs ml-auto'>{order.phone}</p> */}
          </div>
          <div className='flex items-center justify-between'>
            <p className='text-xs'>{order.code}</p>
            <p className='text-xs'>{formattedDate}</p>
          </div>
        </div>
        <div className='w-full px-5 flex gap-5'>
          <Select.Root
            value={entityId}
            onValueChange={(value) => setEntityId(value)}
          >
            <Select.Trigger
              className={cn(
                "inline-flex rounded-lg items-center justify-between gap-[5px] dark:bg-white/15  bg-white px-2 text-[13px] leading-none text-violet11 shadow-[0_2px_10px] shadow-black/10 outline-none hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-violet9 w-full border border-black/30 h-11",
                errors.entityId && "!border-red-400"
              )}
              aria-label='Food'
            >
              <Select.Value placeholder='Select a name…' />
              <Select.Icon className='text-violet11'>
                <ChevronDownIcon width={20} height={20} />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                onPointerDownOutside={(event) => {
                  const target = event.target as HTMLElement;
                  // Prevent closing if the user is interacting with the scroll bar
                  if (target.closest("[data-radix-scroll-area]")) {
                    event.preventDefault();
                  }
                }}
                onEscapeKeyDown={(event) => {
                  // Optional: Handle Escape key if needed
                  console.log("Escape key pressed");
                }}
                className='overflow-hidden dark:bg-[#1A1A1A] rounded-md bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] relative z-50'
              >
                <Select.ScrollUpButton className='flex h-[25px] cursor-default items-center justify-center dark:bg-[#1A1A1A] bg-white text-violet11'>
                  <ChevronUpIcon width={20} height={20} />
                </Select.ScrollUpButton>
                <Select.Viewport className='p-[5px]'>
                  <Select.Group>
                    <Select.Item
                      key={0}
                      value='0'
                      className='flex items-center px-3 py-2 rounded cursor-pointer  dark:hover:bg-white/30 hover:bg-gray-100 focus-visible:outline-none'
                    >
                      <Select.ItemText>
                        <div className='text-sm'>Кто отгрузил</div>
                      </Select.ItemText>
                      <Select.ItemIndicator className='ml-auto'>
                        <CheckIcon width={20} height={20} />
                      </Select.ItemIndicator>
                    </Select.Item>
                    {customEntityData?.rows?.map((option: any) => (
                      <Select.Item
                        key={option.id}
                        value={option.id}
                        className='flex items-center px-3 py-2 rounded cursor-pointer  dark:hover:bg-white/30 hover:bg-gray-100 focus-visible:outline-none'
                      >
                        <Select.ItemText>
                          <div className='text-sm'>{option.name}</div>
                        </Select.ItemText>
                        <Select.ItemIndicator className='ml-auto'>
                          <CheckIcon width={20} height={20} />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Group>
                </Select.Viewport>
                <Select.ScrollDownButton className='flex h-[25px] cursor-default items-center justify-center bg-white dark:bg-[#1A1A1A]  text-violet11'>
                  <ChevronDownIcon width={20} height={20} />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Portal>
          </Select.Root>

          <Select.Root
            value={entityId2}
            onValueChange={(value) => setEntityId2(value)}
          >
            <Select.Trigger
              className={cn(
                "inline-flex rounded-lg items-center justify-between gap-[5px] bg-white px-[15px] text-[13px] leading-none text-violet11 shadow-[0_2px_10px] shadow-black/10 outline-none hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-violet9 w-full border border-black/30 h-11 dark:bg-white/15",
                errors.entityId2 && "!border-red-400"
              )}
              aria-label='Food'
            >
              <Select.Value placeholder='Select a sklad...' />
              <Select.Icon className='text-violet11'>
                <ChevronDownIcon width={20} height={20} />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                onPointerDownOutside={(event) => {
                  const target = event.target as HTMLElement;
                  // Prevent closing if the user is interacting with the scroll bar
                  if (target.closest("[data-radix-scroll-area]")) {
                    event.preventDefault();
                  }
                }}
                onEscapeKeyDown={(event) => {
                  // Optional: Handle Escape key if needed
                  console.log("Escape key pressed");
                }}
                className='overflow-hidden rounded-md bg-white dark:bg-[#1A1A1A] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] relative z-50'
              >
                <Select.ScrollUpButton className='flex h-[25px] cursor-default items-center justify-center bg-white dark:bg-[#1A1A1A] text-violet11'>
                  <ChevronUpIcon width={20} height={20} />
                </Select.ScrollUpButton>
                <Select.Viewport className='p-[5px]'>
                  <Select.Group>
                    <Select.Item
                      key='0'
                      value='0'
                      className='flex items-center px-3 py-2 rounded cursor-pointer dark:hover:bg-white/30 hover:bg-gray-100 focus-visible:outline-none '
                    >
                      <Select.ItemText>
                        <div className='text-sm'>Бригада</div>
                      </Select.ItemText>
                      <Select.ItemIndicator className='ml-auto'>
                        <CheckIcon width={20} height={20} />
                      </Select.ItemIndicator>
                    </Select.Item>
                    {customEntityData2?.rows?.map((option: any) => (
                      <Select.Item
                        key={option.id}
                        value={option.id}
                        className='flex items-center px-3 py-2 rounded cursor-pointer dark:hover:bg-white/30 hover:bg-gray-100 focus-visible:outline-none'
                      >
                        <Select.ItemText>
                          <div className='text-sm'>{option.name}</div>
                        </Select.ItemText>
                        <Select.ItemIndicator className='ml-auto'>
                          <CheckIcon width={20} height={20} />
                        </Select.ItemIndicator>
                      </Select.Item>
                    ))}
                  </Select.Group>
                </Select.Viewport>
                <Select.ScrollDownButton className='flex h-[25px] cursor-default items-center justify-center bg-white dark:bg-[#1A1A1A]  text-violet11'>
                  <ChevronDownIcon />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      </div>

      <div>
        <Table className='rounded-xl border-zinc-100'>
          <TableHeader>
            <TableRow className='border-t  font-bold'>
              <TableHead className='w-1/2'>Tovar Nomi</TableHead>
              <TableHead>Soni</TableHead>
              <TableHead>Yuklandi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className='font-medium'>{product.name}</TableCell>
                <TableCell>
                  <span>{product.quantity}</span>
                </TableCell>
                <TableCell>
                  <Checkbox
                    className='block mx-auto'
                    // @ts-ignore
                    defaultValue={
                      product.quantity === product.shipped &&
                      selectedProducts.includes(product.id)
                    }
                    checked={selectedProducts.includes(product.id)}
                    onClick={() => toggleId(product.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            {commentPro && (
              <TableRow>
                <TableCell className='text-xs pt-5' colSpan={3}>
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
                  className='w-full p-2 resize-none bg-secondary rounded'
                  placeholder='Comment'
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
              <TableCell colSpan={3} className='text-right'>
                <Button
                  size='sm'
                  className='w-full'
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

      <Toast.Provider swipeDirection='up'>
        <Toast.Root
          className='bg-white border border-gray-300 rounded-md shadow-lg p-4 flex items-center space-x-4'
          open={openToast}
          onOpenChange={setOpenToast}
        >
          <Toast.Title className='text-3xl min-w-6'>
            <QuestionMarkCircledIcon width={24} height={24} color='#FF4B68' />
          </Toast.Title>
          <Toast.Description className='text-sm text-gray-600'>
            {
              // eslint-disable-next-line react/no-unescaped-entities
              `"Кто отгрузил" ва "Бригада" ни танлаш мажбурий`
            }
          </Toast.Description>
          <Toast.Close
            className='ml-auto text-gray-400 hover:text-gray-800'
            aria-label='Close'
          >
            <Cross1Icon />
          </Toast.Close>
        </Toast.Root>
        <Toast.Viewport className='fixed top-4 left-1/2 transform -translate-x-1/2 flex flex-col space-y-2 w-96 max-w-full z-50' />
      </Toast.Provider>
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
