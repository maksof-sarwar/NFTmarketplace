'use client';

import { Currency } from '@/components/currency';
import { DataTableColumnHeader } from '@/components/data-table/header';
import { TimeAgo } from '@/components/time-ago';
import { Button } from '@/components/ui/button';
import { formatTokenName, shortenAddress } from '@/lib/utils';
import { RouterOutputs } from '@marketplace/api';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import Link from 'next/link';
import { Def } from '.';

export const columns: ColumnDef<Def[number]>[] = [
	{
		accessorKey: 'assets',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Assets" />
		),
		cell: ({ row }) =>
			row.original.collectionToken && (
				<div className="font-sans font-medium uppercase flex gap-6 items-center dark:text-white">
					<div className="aspect-square size-16 rounded-lg overflow-hidden">
						<Image
							alt="logo"
							width={100}
							height={100}
							src={row.original.collectionToken?.image}
							className="w-full h-full"
						/>
					</div>
					<div className="inline-flex justify-center items-center gap-1">
						<Link
							href={`/collection/${row.original.collectionToken.collection.address}/${row.original.collectionToken.tokenId}`}
							className="whitespace-nowrap hover:underline"
						>
							{formatTokenName(
								row.original.collectionToken.name,
								row.original.collectionToken.tokenId
							)}
						</Link>
					</div>
				</div>
			),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'activity',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Activity" />
		),
		cell: ({ row }) => {
			const rest = row.original;
			return (
				<div className=" uppercase text-start font-sans  dark:text-white">
					<div className="inline-flex flex-col gap-y-2">
						<span>{rest.type}</span>
						<span className="font-thin text-xs ">
							<TimeAgo datetime={rest.createdAt} />
						</span>
					</div>
				</div>
			);
		},
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'user',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="User" />
		),
		cell: ({ row: _row }) => {
			const row = _row.original;
			return (
				<div className="font-medium flex gap-3  items-center  dark:text-white">
					<Button size="icon" className="size-10 rounded-full">
						<span className="icon-[carbon--user-avatar-filled] text-2xl"></span>
					</Button>
					<Link href={`/profile/${row.seller}`}>
						{shortenAddress(row.seller)}
					</Link>
					{row.type === 'SOLD' && (
						<div className="flex gap-3 justify-center items-center">
							<span className="font-sans">FROM</span>
							<Button size="icon" className="size-10 rounded-full">
								<span className="icon-[carbon--user-avatar-filled] text-2xl"></span>
							</Button>
							<Link href={`/profile/${row.buyer}`}>
								{shortenAddress(row.buyer!)}
							</Link>
						</div>
					)}
				</div>
			);
		},
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'amount',
		header: ({ column }) => (
			<DataTableColumnHeader
				className="text-end"
				column={column}
				title="Amount"
			/>
		),
		cell: ({ row }) => (
			<div className="font-medium flex flex-col gap-1 items-end dark:text-white">
				<Currency value={row.original.price} />
			</div>
		),
		enableSorting: false,
		enableHiding: false,
	},
];
