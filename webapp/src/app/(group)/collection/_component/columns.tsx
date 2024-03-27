"use client";

import { Currency } from "@/components/currency";
import { DataTableColumnHeader } from "@/components/data-table/header";
import { Icons } from "@/components/icons";
import { Owner } from "@/components/token-owner";
import { cn, formatNumber, roundNumber } from "@/lib/utils";
import { RouterOutputs } from "@marketplace/api";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";

type Def = RouterOutputs["collection"]["getTopCollections"][number];
export const columns: ColumnDef<Def>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="#" />,
    cell: ({ row }) => <div className="text-start dark:text-white">{row.original.rank}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "collection",
    header: ({ column }) => <DataTableColumnHeader column={column} className="text-start" title="Collection" />,
    cell: ({ row }) => (
      <div className="font-medium uppercase flex gap-2 items-center dark:text-white">
        <div className="aspect-square size-12 rounded-lg overflow-hidden">
          <Image alt="logo" width={100} height={100} src={row.original.logo} className="w-full h-full" />
        </div>
        <div className="inline-flex justify-center items-center gap-1">
          <Icons.dot />
          <Link href={`/collection/${row.original.slug}`} className="heading whitespace-nowrap">
            {row.original.metadata.name}
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
        <div className="font-medium flex flex-col gap-1 text-start dark:text-white">
          <Currency value={rest.floorPrice} />
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
        <div className="font-medium flex flex-col gap-1 text-start dark:text-white">
          <Currency value={rest.volume} />
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "sales",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Sales" />,
    cell: ({ row }) => {
      const rest = row.original;
      return (
        <div className="font-medium font-sans flex flex-col gap-1 text-start dark:text-white">
          <span>{rest.sold_activity_count}</span>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "change",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Change" />,
    cell: ({ row }) => {
      const rest = row.original;
      const changes = parseFloat(rest.floorPrice) - parseFloat(rest.lastFloorPrice);
      return (
        <div className={cn(" flex   flex-col gap-1 text-start dark:text-white", changes >= 0 ? "text-status-success/85" : "text-status-error")}>
          <span>{roundNumber(changes * 100)} %</span>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "owner",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Owners" />,
    cell: ({ row }) => (
      <div className="text-start dark:text-white font-sans font-medium">
        <Owner address={row.original.address} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "supply",
    header: ({ column }) => <DataTableColumnHeader className="text-end" column={column} title="Supply" />,
    cell: ({ row }) => <div className="text-end dark:text-white font-sans font-medium">{formatNumber(row.original.metadata.totalSupply)}</div>,
    enableSorting: false,
    enableHiding: false,
  },
];
