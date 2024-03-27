'use client';

import { Currency } from '@/components/currency';
import { DataTableColumnHeader } from '@/components/data-table/header';
import { Button } from '@/components/ui/button';
import { formatTokenName, shortenAddress } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import Link from 'next/link';
import { Def } from './index';
import { TimeAgo } from '@/components/time-ago';

export const columns: ColumnDef<Def[number]>[] = [
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
				</div>
			);
		},
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
				<div className=" uppercase text-start font-sans  font-thin dark:text-white">
					<span>{rest.type}</span>
				</div>
			);
		},
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'time',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Time" />
		),
		cell: ({ row }) => {
			const rest = row.original;
			return (
				<div className=" uppercase text-start font-sans  dark:text-white">
					<span className="font-thin text-xs ">
						<TimeAgo datetime={rest.createdAt} />
					</span>
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
