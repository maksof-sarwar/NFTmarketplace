'use client';
import { Card } from '@/components/ui/card';
import { Checkbox, CheckboxGroup, Stack } from '@chakra-ui/react';
import { ACTIVITY_TYPE } from '@marketplace/db';
import { useMemo, useState } from 'react';
import { CustomCheckbox } from '../custom-checkbox';
import { cn } from '@/lib/utils';

export type FilterListType = ACTIVITY_TYPE | 'ALL';
const checklistItems: Array<{ label: string; value: FilterListType }> = [
	{ label: 'All', value: 'ALL' },
	{ label: 'Sales', value: 'SOLD' },
	{ label: 'Listings', value: 'LISTING' },
	{ label: 'Withdrawn Listings', value: 'WITHDRAW' },
];

interface FilterBoxProps {
	onCheckedChange?: (value: FilterListType) => void;
}
export const ActivityFilter = ({
	onCheckedChange = () => {},
}: FilterBoxProps) => {
	const [state, setState] = useState<FilterListType>('ALL');
	const checklist = useMemo(
		() =>
			checklistItems.map((item, key) => {
				return (
					<Checkbox
						key={key}
						colorScheme="gray"
						value={item.value}
						isChecked={state === item.value}
						onChange={(e) => {
							onCheckedChange(e.currentTarget.value as FilterListType);
							setState(e.currentTarget.value as FilterListType);
						}}
						className={cn('heading')}
					>
						<span className="text-base font-medium">{item.label}</span>
					</Checkbox>
				);
			}),
		[checklistItems, state]
	);
	return (
		<Card className="p-4">
			<h1 className="text-base font-bold pb-4">Type</h1>
			<Stack spacing={1} direction="column">
				{checklist}
			</Stack>
		</Card>
	);
};
