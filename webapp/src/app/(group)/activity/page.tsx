'use client';
import { DataTable } from '@/components/data-table';
import { GroupButtons } from '@/components/group-buttons';
import { Button, RefreshButton } from '@/components/ui/button';
import { api } from '@/trpc/react';
import { RouterOutputs } from '@marketplace/api';
import { ACTIVITY_TYPE } from '@marketplace/db';
import { useEffect, useState } from 'react';
import { columns } from './columns';

export type Def =
	RouterOutputs['collection']['getCollectionActivity']['activities'];
type Switcher = ACTIVITY_TYPE | 'ALL';
const switcher: Array<{ value: Switcher; label: string }> = [
	{
		label: `View All`,
		value: 'ALL',
	},
	{
		label: `Sales`,
		value: 'SOLD',
	},
	{
		label: `Listing`,
		value: 'LISTING',
	},
	{
		label: `Withdraw`,
		value: 'WITHDRAW',
	},
] as const;

export default () => {
	const [activities, setActivity] = useState<Def>([]);
	const [skip, setSkip] = useState(0);
	const [selectedDate, setSelectedDate] = useState<(typeof switcher)[number]>(
		switcher[0]
	);
	const { refetch, isPending, isFetching, data } =
		api.collection.getCollectionActivity.useQuery({
			type: selectedDate.value === 'ALL' ? undefined : selectedDate.value,
			skip,
		});

	useEffect(() => {
		setActivity([...activities, ...(data?.activities || [])]);
	}, [data]);

	return (
		<div className="flex flex-col">
			<div className="flex items-center gap-x-4 my-10">
				<h1 className="text-3xl font-sans dark:text-white">User Activities</h1>
			</div>
			<main className="space-y-4">
				<div className="flex gap-2">
					<GroupButtons
						defaultValue={selectedDate}
						switches={switcher}
						onChange={(v) => {
							setSelectedDate(v);
							setActivity([]);
							setSkip(0);
						}}
					/>
					<RefreshButton onClick={() => refetch()} isLoading={isFetching} />
				</div>
				<div className="col-span-full space-y-2">
					<DataTable columns={columns} data={activities} manualPagination />
					{(data?.activities?.length || 0) > 0 && (
						<Button
							isLoading={isFetching}
							variant="outline"
							className="font-thin font-sans uppercase"
							onClick={() => {
								setSkip((state) => state + 10);
							}}
						>
							More Details
						</Button>
					)}
				</div>
			</main>
		</div>
	);
};
