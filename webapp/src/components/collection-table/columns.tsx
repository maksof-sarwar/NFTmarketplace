"use client";

import { DataTableColumnHeader } from "@/components/data-table/header";
import { formatNumber } from "@/lib/utils";
import { ColumnDef, Row } from "@tanstack/react-table";
import Link from "next/link";
import { Currency } from "../currency";
import { CollectionTable } from "./type";
import { useEffect, useState } from "react";
import { useTokenHolderCount } from "@/hooks/use-token-holder-count";
import { Spinner } from "../pending";
import Image from "next/image";
import { Icons } from "../icons";
export const columns: ColumnDef<CollectionTable>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" className="items-start" />,
    cell: ({ row }) => <div className="inline-flex items-start dark:text-white">{row.index + 1}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "collection",
    header: ({ column }) => <DataTableColumnHeader column={column} className="text-start" title="Collection" />,
    cell: ({ row }) => (
      <div className="font-medium flex gap-2 items-center dark:text-white">
        <div className="aspect-square size-12 rounded-lg overflow-hidden">
          <Image alt="logo" width={100} height={100} src={row.original.collection.img} className="w-full h-full" />
        </div>
        <div className="inline-flex justify-center items-center gap-1">
          <Icons.dot />
          <Link href={`/collection/${row.original.slug}`} className="heading whitespace-nowrap">
            {row.original.collection.name}
          </Link>
        </div>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "floor",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Floor" />,
    cell: ({ row }) => {
      const rest = row.original;
      return (
        <div className="font-medium flex flex-col gap-1 items-center dark:text-white">
          <Currency value={rest.floor.value} />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "totalVolume",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Volume" />,
    cell: ({ row }) => {
      const rest = row.original;
      return (
        <div className="font-medium flex flex-col gap-1 items-center dark:text-white">
          <Currency value={rest.volume.value} />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  // {
  // 	accessorKey: '24hVolume',
  // 	header: ({ column }) => (
  // 		<DataTableColumnHeader
  // 			className="whitespace-nowrap"
  // 			column={column}
  // 			title="24HR Volume"
  // 		/>
  // 	),
  // 	cell: ({ row }) => {
  // 		const rest = row.original;
  // 		console.log(rest);
  // 		return (
  // 			<div className="font-medium flex flex-col gap-1 items-center dark:text-white">
  // 				<Currency value={rest?.['24hVolume']?.value!} />
  // 			</div>
  // 		);
  // 	},
  // 	enableSorting: false,
  // 	enableHiding: false,
  // },
  {
    accessorKey: "owner",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Owners" />,
    cell: ({ row }) => <Owner address={row.original.address} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "supply",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Supply" />,
    cell: ({ row }) => <div className="inline-flex items-center dark:text-white">{formatNumber(row.original.supply)}</div>,
    enableSorting: false,
    enableHiding: false,
  },
];

function Owner({ address }: { address: string }) {
  const { loading, owner } = useTokenHolderCount(address);
  return <div className="inline-flex items-center dark:text-white">{loading ? <Spinner /> : formatNumber(owner)}</div>;
}
