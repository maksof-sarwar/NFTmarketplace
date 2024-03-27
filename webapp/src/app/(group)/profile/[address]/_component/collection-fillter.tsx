'use client';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { api } from '@/trpc/react';
import { useEffect, useState } from 'react';
export type Filter = {
	collectionAddress?: string;
};

export const CollectionFiltter = ({
	onFilterChange,
}: {
	onFilterChange?: (value: Filter) => void;
}) => {
	const { data: collections = [] } =
		api.userProfile.getTotalCollection.useQuery();
	const [filter, setFilter] = useState<Filter>({});

	useEffect(() => {
		if (onFilterChange) {
			onFilterChange(filter);
		}
	}, [filter]);

	return (
		<div className="p-2">
			<Accordion
				type="single"
				collapsible
				className="w-full font-heading uppercase "
			>
				<AccordionItem value="item-1">
					<AccordionTrigger className="uppercase">Collections</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-y-1">
						{/* @ts-ignore */}
						{collections.map((collection) => (
							<Button
								className="m-1 w-full"
								variant={
									collection.address === filter.collectionAddress
										? 'default'
										: 'outline'
								}
								onClick={() => {
									setFilter((state) => {
										return {
											...state,
											collectionAddress: collection.address,
										};
									});
								}}
							>
								{(collection.metadata as any)?.name}
							</Button>
						))}
					</AccordionContent>
				</AccordionItem>
			</Accordion>
			<Button
				className="w-full uppercase font-heading"
				onClick={() => {
					if (onFilterChange) {
						onFilterChange({});
					}
				}}
			>
				CLEAR FILTERS
			</Button>
		</div>
	);
};
