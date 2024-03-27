'use client';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Prisma } from '@marketplace/db';
import { useCallback, useEffect, useState } from 'react';
export type Filter = {
	traits?: Array<{ trait_type: string; value: string }>;
	rank?: {
		min?: string;
		max?: string;
	};
	price?: {
		min?: string;
		max?: string;
	};
	auction?: 'LISTING' | 'NOT_SALE';
};

export const CollectionFiltter = ({
	traits,
	onFilterChange,
}: {
	traits: Prisma.JsonValue;
	onFilterChange?: (value: Filter) => void;
}) => {
	const [filter, setFilter] = useState<Filter>({});

	const toggleChooseTraits = useCallback((key: string, value: string) => {
		setFilter((state) => {
			let _traits = state.traits ?? [];
			const exist = _traits.find(
				(s) => s.trait_type === key && s.value === value
			);
			_traits = !exist
				? [..._traits, { trait_type: key, value }]
				: _traits.filter((s) => s.value !== value && s.trait_type !== key);
			return {
				...state,
				traits: _traits,
			};
		});
	}, []);
	useEffect(() => {
		if (onFilterChange) {
			onFilterChange(filter);
		}
	}, [filter]);

	const allTraits = ((traits as any)?.['allTrait'] ?? {}) as Record<any, any>;
	return (
		<div className="p-2">
			<Accordion
				type="single"
				collapsible
				className="w-full font-heading uppercase "
			>
				<AccordionItem value="item-1">
					<AccordionTrigger className="uppercase">
						Auction Type
					</AccordionTrigger>
					<AccordionContent className="flex flex-col gap-y-1">
						<Button
							className="m-1 w-full"
							variant={filter.auction === 'LISTING' ? 'default' : 'outline'}
							onClick={() => {
								setFilter((state) => {
									return {
										...state,
										auction:
											state.auction === 'LISTING' ? undefined : 'LISTING',
									};
								});
							}}
						>
							Buy Now
						</Button>
						<Button
							className="m-1 w-full"
							onClick={() => {
								setFilter((state) => {
									return {
										...state,
										auction:
											state.auction === 'NOT_SALE' ? undefined : 'NOT_SALE',
									};
								});
							}}
							variant={filter.auction === 'NOT_SALE' ? 'default' : 'outline'}
						>
							Not For Sale
						</Button>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-2">
					<AccordionTrigger className="uppercase">Price</AccordionTrigger>
					<AccordionContent>
						<div className="grid grid-cols-5 gap-4">
							<Input
								type="number"
								min={0}
								placeholder="Min"
								value={filter.price?.min || undefined}
								className="w-full col-span-2 bg-primary/50 text-white placeholder:text-white"
								onChange={(e) => {
									const value = e.currentTarget.value;
									setFilter({
										...filter,
										auction: undefined,
										price: {
											...filter.price,
											min: value,
										},
									});
								}}
							/>
							<Input
								type="number"
								min={0}
								placeholder="Max"
								value={filter.price?.max || undefined}
								className="w-full col-span-2 bg-primary/50 text-white placeholder:text-white"
								onChange={(e) => {
									const value = e.currentTarget.value;
									setFilter({
										...filter,
										auction: undefined,
										price: {
											...filter.price,
											max: value,
										},
									});
								}}
							/>
						</div>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-3">
					<AccordionTrigger className="uppercase">Rarity Rank</AccordionTrigger>
					<AccordionContent>
						<div className="grid grid-cols-2 gap-4">
							<Input
								type="number"
								min={0}
								className=" bg-primary/50 text-white placeholder:text-white"
								placeholder="Min"
								value={filter.rank?.min || undefined}
								onChange={(e) => {
									const value = e.currentTarget.value;
									setFilter({
										...filter,
										rank: {
											...filter.rank,
											min: value,
										},
									});
								}}
							/>
							<Input
								type="number"
								min={0}
								className=" bg-primary/50 text-white placeholder:text-white"
								value={filter.rank?.max || undefined}
								onChange={(e) => {
									const value = e.currentTarget.value;
									setFilter({
										...filter,
										rank: {
											...filter.rank,
											max: value,
										},
									});
								}}
							/>
						</div>
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-4">
					<AccordionTrigger className="uppercase">Traits</AccordionTrigger>
					<AccordionContent>
						<Accordion type="single" collapsible className="w-full px-2">
							{Object.entries(allTraits).map(([mkey, value], idx) => (
								<AccordionItem value={idx.toString()} key={idx} className="">
									<AccordionTrigger className="uppercase font-sans font-thin">
										{mkey}
									</AccordionTrigger>
									<AccordionContent>
										{Object.entries(value)
											.filter(([key]) => key !== 'sum')
											.map(([key, value]: any, jdx) => (
												<Button
													key={jdx}
													onClick={() => toggleChooseTraits(mkey, key)}
													className="m-1 tex-xs uppercase"
													variant={
														!!filter.traits?.find(
															(c) => c.trait_type === mkey && c.value === key
														)
															? 'default'
															: 'outline'
													}
												>
													{key} ({value})
												</Button>
											))}
									</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
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
