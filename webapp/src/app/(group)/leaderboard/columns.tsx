'use client';

import { CopyToClipboard } from '@/components/copy-to-clipboard';
import { Currency } from '@/components/currency';
import { DataTableColumnHeader } from '@/components/data-table/header';
import { Button } from '@/components/ui/button';
import { calulateUserPoints, shortenAddress } from '@/lib/utils';
import { RouterOutputs } from '@marketplace/api';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

type Leaderboard = RouterOutputs['leaderboard']['getLeaderboardList'][number];

export const columns: ColumnDef<Leaderboard>[] = [
	{
		accessorKey: 'id',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title="#"
				className="items-start"
			/>
		),
		cell: ({ row }) => (
			<div className=" text-start font-sans font-medium">
				{row.original.rank}
			</div>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'name',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Name" />
		),
		cell: ({ row }) => (
			<div className="font-medium flex gap-2 items-center">
				<Button size="icon" className="size-10 rounded-full">
					<span className="icon-[carbon--user-avatar-filled] text-2xl"></span>
				</Button>
				<Link href={`/profile/${row.original.buyer}`}>
					{shortenAddress(row.original.buyer!)}
				</Link>
			</div>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'buy',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title="Buy Volume"
				className="text-end"
			/>
		),
		cell: ({ row }) => {
			const _row = row.original;
			return (
				<div className="font-medium flex flex-col gap-1 items-end">
					<Currency value={_row.volume} />
				</div>
			);
		},
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'no-of-buys',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title="Number of Buys"
				className="text-end"
			/>
		),
		cell: ({ row }) => {
			const _row = row.original;
			return (
				<div className="font-medium font-sans flex flex-col gap-1 items-end">
					<span>{_row.buyCount}</span>
				</div>
			);
		},
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'points',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title="Points"
				className="text-end"
			/>
		),
		cell: ({ row }) => {
			const rest = row.original;
			return (
				<div className="font-heading flex flex-col gap-1 items-end">
					<span>{calulateUserPoints(rest.volume, rest.buyCount)}</span>
				</div>
			);
		},
		enableSorting: false,
		enableHiding: false,
	},
];
