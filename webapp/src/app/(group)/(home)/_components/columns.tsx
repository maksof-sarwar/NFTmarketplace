'use client';

import { Currency } from '@/components/currency';
import { DataTableColumnHeader } from '@/components/data-table/header';
import { Icons } from '@/components/icons';
import { Owner } from '@/components/token-owner';
import { formatNumber } from '@/lib/utils';
import { RouterOutputs } from '@marketplace/api';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import Link from 'next/link';

type Def = RouterOutputs['collection']['getTopCollections'][number];
export const columns: ColumnDef<Def>[] = [
	{
		accessorKey: 'id',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Rank" />
		),
		cell: ({ row }) => (
			<div className="text-start dark:text-white p-2">{row.original.rank}</div>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'collection',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Collection" />
		),
		cell: ({ row }) => (
			<div className="font-medium flex uppercase gap-2 items-center dark:text-white">
				<div className="aspect-square size-[70px] rounded-lg overflow-hidden">
					<Image
						alt="logo"
						width={100}
						height={100}
						src={row.original.logo}
						className="w-full h-full"
					/>
				</div>
				<div className="inline-flex justify-center items-center gap-1">
					<Icons.dot />
					<Link
						href={`/collection/${row.original.slug}`}
						className="heading whitespace-nowrap"
					>
						{row.original.metadata.name}
					</Link>
				</div>
			</div>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'floor',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title="Floor"
				className="text-end"
			/>
		),
		cell: ({ row }) => {
			const rest = row.original;
			return (
				<div className="font-medium flex flex-col gap-1 items-end dark:text-white">
					<Currency value={rest.floorPrice} />
				</div>
			);
		},
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'totalVolume',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title="Volume"
				className="text-end"
			/>
		),
		cell: ({ row }) => {
			const rest = row.original;
			return (
				<div className="font-medium flex flex-col gap-1 items-end dark:text-white">
					<Currency value={rest.volume} />
				</div>
			);
		},
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'owner',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title="Owners"
				className="text-end"
			/>
		),
		cell: ({ row }) => (
			<div className="font-medium flex flex-col gap-1 items-end dark:text-white">
				<Owner address={row.original.address} className="p-2" />
			</div>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'supply',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title="Supply"
				className="text-end"
			/>
		),
		cell: ({ row }) => (
			<div className=" font-sans font-medium text-end dark:text-white p-2">
				<span>{formatNumber(row.original.metadata.totalSupply)}</span>
			</div>
		),
		enableSorting: false,
		enableHiding: false,
	},
];
