'use client';
import {
	ChakraTab,
	ChakraTabs,
	TabList,
	TabPanel,
	TabPanels,
} from '@/components/chakra-tabs';
import { CollectionTokenCard } from '@/components/collection-token-card';
import { DataTable } from '@/components/data-table';
import { Button, RefreshButton } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TViewMode, ViewMode } from '@/components/view-mode';
import { useSweep } from '@/hooks/use-sweep';
import { cn, removeEmptyValues } from '@/lib/utils';
import { api } from '@/trpc/react';
import { CollectionTokens } from '@/types';
import { useDebounce } from '@uidotdev/usehooks';
import Image from 'next/image';
import { Fragment, useMemo, useState } from 'react';
import { Activity } from './activity';
import { CollectionFiltter, Filter } from './collection-fillter';
import { columns } from './column';
import { Sweep } from './sweep';
import { useContract } from '@/hooks/use-contract';

type Props = {
	slug: any;
	traits: any;
};
export const TokenList = ({ slug, traits }: Props) => {
	const { account } = useContract();
	const [filter, setFilter] = useState<Filter & { tokenId?: string }>({});
	const debounceFilter = useDebounce(filter, 1000);
	const {
		data: collectionTokens = [],
		isFetching,
		refetch,
	} = api.collectionToken.getCollectionTokens.useQuery<CollectionTokens[]>({
		slug,
		...removeEmptyValues(debounceFilter),
	});
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const [view, setView] = useState<TViewMode>('GRID');
	const { sweepItems, setSweep } = useSweep();
	const collectionFilter = useMemo(
		() => (
			<CollectionFiltter
				traits={traits}
				onFilterChange={(filter) => {
					if (Object.keys(filter).length === 0) {
						setFilter({});
					}
					setFilter((state) => ({ ...state, ...filter }));
				}}
			/>
		),
		[traits]
	);
	return (
		<Fragment>
			<ChakraTabs variant="unstyled" className=" w-full space-y-3 ">
				<div className="flex justify-between items-center ">
					<div className="flex gap-2 justify-between">
						<Button
							size="icon"
							variant="outline"
							onClick={() => setIsVisible(!isVisible)}
						>
							<Image
								src="/svg/filter-format.svg"
								alt="filter"
								className="w-6"
								width={50}
								height={50}
							/>
						</Button>
						<div className="flex gap-2">
							<TabList className="gap-3">
								<ChakraTab>Items</ChakraTab>
								<ChakraTab>Activity</ChakraTab>
							</TabList>
							<RefreshButton
								className="mx-4"
								isLoading={isFetching}
								onClick={() => refetch()}
							/>
							<Input
								onChange={(e) => {
									setFilter({ ...filter, tokenId: e.currentTarget.value });
								}}
								value={filter.tokenId}
								className="w-[200px]"
								placeholder="Search by name or id"
							/>
							<ViewMode onViewModeChange={setView} defaultViewMode={view} />
						</div>
					</div>
					<Sweep tokens={collectionTokens} />
				</div>
				<TabPanels>
					<TabPanel className="!p-0">
						<div className="grid grid-cols-5 gap-2">
							{isVisible && (
								<div className="lg:col-span-1 md:col-span-2">
									<Card>{collectionFilter}</Card>
								</div>
							)}
							<div
								className={cn(
									isVisible ? 'lg:col-span-4 col-span-3' : 'col-span-5'
								)}
							>
								{view === 'GRID' ? (
									<div
										className={cn(
											isVisible
												? 'xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1'
												: 'xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2',
											'grid grid-cols-1 gap-4'
										)}
									>
										{collectionTokens.map((token, key) => (
											<CollectionTokenCard
												onCheckboxChange={(checked, token) => {
													if (token.seller === account) {
														return;
													}
													if (checked) {
														sweepItems.push({
															listingId: token.listingId,
															price: token.price,
															tokenId: token.token_id,
														});
													} else {
														sweepItems.splice(
															sweepItems.findIndex(
																(sweep) => sweep.tokenId === token.token_id
															),
															1
														);
													}
													setSweep(sweepItems);
												}}
												token={token}
												isChecked={
													!!sweepItems.find(
														(sweep) => sweep.tokenId === token.token_id
													)
												}
												key={key}
												shouldShowCheckbox
											/>
										))}
									</div>
								) : (
									<DataTable
										columns={columns}
										data={collectionTokens}
										manualPagination
									/>
								)}
							</div>
						</div>
					</TabPanel>
					<TabPanel className="!p-0">
						<Activity slug={slug} />
					</TabPanel>
				</TabPanels>
			</ChakraTabs>
		</Fragment>
	);
};
