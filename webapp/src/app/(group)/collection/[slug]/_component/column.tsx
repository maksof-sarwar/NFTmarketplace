'use client';

import { Currency } from '@/components/currency';
import { DataTableColumnHeader } from '@/components/data-table/header';
import { Checkbox } from '@/components/ui/checkbox';
import { formatTokenName, shortenAddress } from '@/lib/utils';
import { CollectionMetadata, CollectionTokens } from '@/types';
import { RouterOutputs } from '@marketplace/api';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import Link from 'next/link';

export const columns: ColumnDef<CollectionTokens>[] = [
	// {
	// 	accessorKey: 'id',
	// 	header: ({ column }) => (
	// 		<DataTableColumnHeader column={column} title="CART" />
	// 	),
	// 	cell: ({ row }) => <Checkbox className="rounded-[2px]" />,
	// 	enableSorting: false,
	// 	enableHiding: false,
	// },
	{
		accessorKey: 'assets',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				className="text-start"
				title="Assets"
			/>
		),
		cell: ({ row }) => {
			const _row = row.original;
			return (
				<div className="font-sans font-thin flex gap-2 items-center">
					<div className="aspect-square size-12 rounded-lg overflow-hidden">
						<Image
							width={50}
							height={50}
							alt="token"
							src={_row.image}
							className="w-full h-full"
						/>
					</div>
					<Link
						href={`/collection/${row.original.address}/${row.original.token_id}`}
						className="whitespace-nowrap hover:underline"
					>
						{formatTokenName(row.original.name, row.original.token_id)}
					</Link>
				</div>
			);
		},
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'price',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				className="text-start"
				title="PRICE / MIN. BID"
			/>
		),
		cell: ({ row }) => {
			const _row = row.original;
			return (
				<div className="flex gap-x-[1px]">
					<span className=" text-lg text-primary ">
						<Currency value={_row.price ?? 0} />
					</span>
				</div>
			);
		},
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'topbid',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="TOP BID" />
		),
		cell: ({ row }) => {
			return (
				<div className="flex justify-start gap-x-[1px]">
					<span className="icon-[ph--globe-light] text-lg text-primary"></span>
					<span className="text-base font-bold">-</span>
				</div>
			);
		},
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'OWNER',
		header: ({ column }) => (
			<DataTableColumnHeader
				column={column}
				title="OWNER"
				className="text-end"
			/>
		),
		cell: ({ row }) => {
			const _row = row.original;
			return (
				<div className="flex justify-end">
					<Link
						href={`/profile/${_row.seller}`}
						className="hover:underline font-thin font-sans"
					>
						{shortenAddress(_row.seller || '')}
					</Link>
				</div>
			);
		},
		enableSorting: false,
		enableHiding: false,
	},
];
