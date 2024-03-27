import { Activity } from '@/components/activity-card';
import {
	ActivityFilter,
	FilterListType,
} from '@/components/activity-card/activity-filter';
import { DaySwitcher } from '@/components/day-switcher';
import { Button } from '@/components/ui/button';
import { useNftListing } from '@/hooks/use-contract';
import { api } from '@/trpc/react';
import { NftToken } from '@/types';
import dynamic from 'next/dynamic';
import { Fragment, useState } from 'react';
const MockChart = dynamic(
	() => import('@/components/chart').then((m) => m.MockChart),
	{ ssr: false }
);

const daySwticher = ['7D', '30D', 'ALL'];

interface CollectionActivitiesProps {
	tokenIds: string[];
}

export const CollectionActivities = ({
	tokenIds,
}: CollectionActivitiesProps) => {
	const [type, setType] = useState<FilterListType>('ALL');
	const { refetch, isFetching, data } =
		api.collection.getCollectionActivity.useQuery({
			tokenIds,
			type: type === 'ALL' ? undefined : type,
		});
	return (
		<Fragment>
			<div className="flex items-center gap-x-4 my-7">
				<h1 className="text-3xl font-bold dark:text-white">Activities</h1>
				<Button size={'icon'} onClick={() => refetch()} isLoading={isFetching}>
					<span className="icon-[basil--refresh-solid] text-2xl"></span>
				</Button>
			</div>
			<div className="grid lg:grid-cols-4 grid-cols-1 gap-x-4">
				<div className="lg:col-span-3">
					<div className="flex items-center justify-between">
						<h1 className="text-2xl font-bold dark:text-white">Volume (SEI)</h1>
						<DaySwitcher switches={daySwticher} />
					</div>
					<div className="py-3">
						<MockChart />
					</div>
					<div className="lg:hidden block">
						<ActivityFilter onCheckedChange={setType} />
					</div>
					{data?.activities?.length > 0 && (
						<Fragment>
							<hr className="mt-2 mb-4" />
							<div className="space-y-2">
								{/* @ts-ignore */}
								<Activity activities={data?.activities} />
							</div>
						</Fragment>
					)}
				</div>
				<div className="lg:block hidden">
					<ActivityFilter />
				</div>
			</div>
		</Fragment>
	);
};
