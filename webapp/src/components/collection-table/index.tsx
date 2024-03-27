'use client';

import { DataTable } from '@/components/data-table';
import { useMemo } from 'react';
import { columns } from './columns';
import { Collection, CollectionTable as _CollectionTableProps } from './type';
import { Card } from '../ui/card';

interface CollectionTableProps {
	_collections: Array<Collection & { owner?: number; supply?: number }>;
}

export const CollectionTable = ({ _collections }: CollectionTableProps) => {
	const collections = useMemo<_CollectionTableProps[]>(
		() =>
			_collections?.map((collection) => {
				return {
					address: collection.address,
					'24hVolume': {
						value: collection['24hVolume'].toString(),
						inUsd: '0',
					},
					floor: {
						value: collection['floorPrice'].toString(),
						inUsd: '0',
					},
					collection: {
						img: collection.logo,
						name: collection.name,
					},
					supply: collection.totalSupply,
					volume: {
						value: collection['totalVolume'].toString(),
						inUsd: '0',
					},
					slug: collection.slug,
				};
			}),
		[_collections]
	);
	return <DataTable columns={columns} data={collections || []} />;
};
