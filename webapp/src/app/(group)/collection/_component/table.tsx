'use client';
import {
	ChakraTab,
	ChakraTabs,
	TabList,
	TabPanel,
	TabPanels,
} from '@/components/chakra-tabs';
import { DataTable } from '@/components/data-table';
import { GroupButtons } from '@/components/group-buttons';
import { Spinner } from '@/components/pending';
import { Button, RefreshButton, buttonVariants } from '@/components/ui/button';
import { api } from '@/trpc/react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { columns } from './columns';

const switcher = ['1H', '6H', '24H', '7D'] as const;

export const Table = () => {
	const [daySwitch, setDaySwitch] = useState<any>(switcher[2]);
	const {
		data: collections = [],
		refetch,
		isPending,
		isFetching,
	} = api.collection.getTopCollections.useQuery({
		duration: daySwitch,
	});

	const collectionTable = useMemo(
		() => <DataTable columns={columns} data={collections} />,
		[collections]
	);
	return (
		<ChakraTabs variant="unstyled">
			<div className="flex justify-between py-6">
				<TabList className="gap-3">
					<ChakraTab onClick={() => setDaySwitch(switcher[2])}>
						TRENDING
					</ChakraTab>
					<ChakraTab onClick={() => setDaySwitch('')}>TOP</ChakraTab>
					<RefreshButton onClick={() => refetch()} isLoading={isFetching} />
				</TabList>
				<div className="flex gap-2">
					{daySwitch && (
						<GroupButtons
							defaultValue={daySwitch}
							switches={switcher}
							onChange={(v) => setDaySwitch(v)}
						/>
					)}
					<Button className="font-heading">VITRUVEO BLOCKCHAIN</Button>
					<Link
						href="/collection"
						className={buttonVariants({
							variant: 'outline',
							className: 'text-xs',
						})}
					>
						VIEW ALL
					</Link>
				</div>
			</div>
			{isPending ? (
				<Spinner className="text-center w-full text-5xl" />
			) : (
				<TabPanels>
					<TabPanel className="!p-0">{collectionTable}</TabPanel>
					<TabPanel className="!p-0">{collectionTable}</TabPanel>
				</TabPanels>
			)}
		</ChakraTabs>
	);
};
