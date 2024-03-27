'use client';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';
import { RouterOutputs } from '@marketplace/api';
import dynamic from 'next/dynamic';
import { Fragment, useEffect, useState } from 'react';
import { columns } from './columns';
const ActivityChart = dynamic(
	() => import('@/components/chart').then((m) => m.ActivityChart),
	{ ssr: false }
);

export type Def =
	RouterOutputs['collection']['getCollectionActivity']['activities'];
interface ActivityProps {
	slug: string;
}

export const Activity = ({ slug }: ActivityProps) => {
	const [activities, setActivity] = useState<Def>([]);
	const [skip, setSkip] = useState(0);
	const { refetch, isFetching, data } =
		api.collection.getCollectionActivity.useQuery({
			slug,
			skip,
			type: undefined,
		});

	useEffect(() => {
		setActivity([...activities, ...(data?.activities || [])]);
	}, [data]);

	return (
		<Fragment>
			<div className="grid grid-cols-1 gap-x-4">
				<div className="lg:col-span-3">
					<div className="py-3">
						<ActivityChart slug={slug} />
					</div>

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
			</div>
		</Fragment>
	);
};
