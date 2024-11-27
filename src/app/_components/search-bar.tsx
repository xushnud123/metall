"use client";

import React, { FC, Suspense } from "react";
import { StringParam, useQueryParams, withDefault } from "use-query-params";
import * as Select from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import { useGetCustomEntity } from "@/hooks/use-get-custom-entity";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = ({}) => {
  const { data: customEntityData, isLoading } = useGetCustomEntity();
  const { data, isLoading: warehousesLoading } = useQuery({
    queryKey: ["WAREHOUSES"],
    queryFn: async () => {
      const res = await axios.get("/api/warehouses");
      return res.data;
    },
  });

  const [query, setQuery] = useQueryParams({
    name: withDefault(StringParam, "all", true),
    warehouse: withDefault(StringParam, "all", true),
  });

  return (
    <Suspense>
      <div className='w-full gap-4 flex flex-coll'>
        <Select.Root
          value={query.name}
          onValueChange={(value) => setQuery({ name: value })}
          defaultValue='0'
        >
          <Select.Trigger
            className='inline-flex h-[35px] items-center justify-between gap-[5px] rounded dark:bg-white/15 bg-white px-2 text-[13px] leading-none text-violet11 shadow-[0_2px_10px] shadow-black/10 outline-none hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-violet9 w-[180px]'
            aria-label='Food'
          >
            <Select.Value placeholder='Select a name…' />
            <Select.Icon className='text-violet11'>
              <ChevronDownIcon />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className='overflow-hidden dark:bg-[#1A1A1A] rounded-md bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] relative z-50'>
              <Select.ScrollUpButton className='flex h-[25px] cursor-default items-center justify-center dark:bg-[#1A1A1A] bg-white text-violet11'>
                <ChevronUpIcon />
              </Select.ScrollUpButton>
              <Select.Viewport className='p-[5px]'>
                <Select.Group>
                  <Select.Item
                    key={0}
                    value='all'
                    className='flex items-center px-3 py-2 rounded cursor-pointer dark:hover:bg-white/30 hover:bg-gray-100 focus-visible:outline-none'
                  >
                    <Select.ItemText>
                      <div className='text-sm'>All</div>
                    </Select.ItemText>
                    <Select.ItemIndicator className='ml-auto'>
                      <CheckIcon width={16} height={16} />
                    </Select.ItemIndicator>
                  </Select.Item>
                  {customEntityData?.rows?.map((option: any) => (
                    <Select.Item
                      key={option.id}
                      value={option.name}
                      className='flex items-center px-3 py-2 rounded cursor-pointer dark:hover:bg-white/30 hover:bg-gray-100 focus-visible:outline-none'
                    >
                      <Select.ItemText>
                        <div className='text-sm'>{option.name}</div>
                      </Select.ItemText>
                      <Select.ItemIndicator className='ml-auto'>
                        <CheckIcon width={16} height={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Viewport>
              <Select.ScrollDownButton className='flex h-[25px] cursor-default items-center justify-center dark:bg-[#1A1A1A] bg-white text-violet11'>
                <ChevronDownIcon />
              </Select.ScrollDownButton>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
        <Select.Root
          value={query.warehouse}
          onValueChange={(value) => setQuery({ warehouse: value })}
          defaultValue='0'
        >
          <Select.Trigger
            className='inline-flex h-[35px] items-center justify-between gap-[5px] rounded dark:bg-white/15 bg-white px-[15px] text-[13px] leading-none text-violet11 shadow-[0_2px_10px] shadow-black/10 outline-none hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-violet9 w-[180px]'
            aria-label='Food'
          >
            <Select.Value placeholder='Select a sklad...' />
            <Select.Icon className='text-violet11'>
              <ChevronDownIcon />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className='overflow-hidden dark:bg-[#1A1A1A] rounded-md bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] relative z-50'>
              <Select.ScrollUpButton className='flex h-[25px] cursor-default items-center justify-center dark:bg-[#1A1A1A] bg-white text-violet11'>
                <ChevronUpIcon />
              </Select.ScrollUpButton>
              <Select.Viewport className='p-[5px]'>
                <Select.Group>
                  <Select.Item
                    key='0'
                    value='all'
                    className='flex items-center px-3 py-2 rounded cursor-pointer dark:hover:bg-white/30 hover:bg-gray-100 focus-visible:outline-none'
                  >
                    <Select.ItemText>
                      <div className='text-sm'>All</div>
                    </Select.ItemText>
                    <Select.ItemIndicator className='ml-auto'>
                      <CheckIcon width={16} height={16} />
                    </Select.ItemIndicator>
                  </Select.Item>
                  {data?.rows?.map((option: any) => (
                    <Select.Item
                      key={option.id}
                      value={option.name}
                      className='flex items-center px-3 py-2 rounded cursor-pointer dark:hover:bg-white/30 hover:bg-gray-100 focus-visible:outline-none'
                    >
                      <Select.ItemText>
                        <div className='text-sm'>{option.name}</div>
                      </Select.ItemText>
                      <Select.ItemIndicator className='ml-auto'>
                        <CheckIcon width={16} height={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Viewport>
              <Select.ScrollDownButton className='flex h-[25px] cursor-default items-center justify-center dark:bg-[#1A1A1A] bg-white text-violet11'>
                <ChevronDownIcon />
              </Select.ScrollDownButton>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
    </Suspense>
  );
};

export default SearchBar;
