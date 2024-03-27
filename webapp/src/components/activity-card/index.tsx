'use client';
import { NoRecordFound } from '@/components/no-record-found';
import { Activity } from '@/types';
import { ActivityCard } from './activity-card';

interface ActivityProps {
	activities: Activity[];
	isLoading: boolean;
}

export function Activity({ activities, isLoading }: ActivityProps) {
	if (isLoading) {
		return (
			<h3 className="text-center w-full font-heading text-4xl">Loading...</h3>
		);
	}
	if (activities?.length === 0) {
		return <NoRecordFound />;
	}
	return activities?.map((activity, key) => (
		<ActivityCard activity={activity} key={key} />
	));
}
