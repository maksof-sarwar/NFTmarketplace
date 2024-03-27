'use client';
import { DataTable } from '@/components/data-table';
import { GroupButtons } from '@/components/group-buttons';
import { Button, RefreshButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { api } from '@/trpc/react';
import { useState } from 'react';
import { columns } from './columns';

const switcher = ['24H', '7D', 'View All'] as const;

export default () => {
	const [daySwitch, setDaySwitch] = useState<any>(switcher[2]);
	const {
		data: leaderboard = [],
		isFetching,
		refetch,
	} = api.leaderboard.getLeaderboardList.useQuery({
		duration: daySwitch === 'View All' ? undefined : daySwitch,
	});
	return (
		<div className="flex flex-col">
			<div className="flex flex-col my-10">
				<h1 className="text-3xl font-sans dark:text-white">
					Points Leaderboard
				</h1>
				<div className="grid grid-cols-4 gap-x-4">
					{Array.from(new Array(4)).map((_, i) => (
						<div
							style={{
								backgroundImage: `url(/svg/Leaderboard-Banner${i + 1}.svg)`,
							}}
							className={cn(
								'max-h-[220px]    h-screen block rounded  overflow-hidden   bg-contain bg-no-repeat bg-center'
							)}
						></div>
					))}
				</div>
			</div>
			<main className="space-y-4">
				<div className="flex gap-2 justify-between items-center w-full">
					<div className="flex gap-2 items-center">
						<Button>Season 1</Button>
						<RefreshButton onClick={() => refetch()} isLoading={isFetching} />
					</div>
					<div>
						<GroupButtons
							defaultValue={daySwitch}
							switches={switcher}
							onChange={(v) => {
								setDaySwitch(v);
							}}
						/>
					</div>
				</div>
				<DataTable columns={columns} data={leaderboard} />
			</main>
		</div>
	);
};
