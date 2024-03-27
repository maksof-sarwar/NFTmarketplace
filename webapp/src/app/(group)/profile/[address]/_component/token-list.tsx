'use client';
import {
	ChakraTab,
	ChakraTabs,
	TabList,
	TabPanel,
	TabPanels,
} from '@/components/chakra-tabs';
import { CollectionTokenCard } from '@/components/collection-token-card';
import { Button, RefreshButton } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TViewMode, ViewMode } from '@/components/view-mode';
import { cn, removeEmptyValues } from '@/lib/utils';
import { api } from '@/trpc/react';
import { useDebounce } from '@uidotdev/usehooks';
import Image from 'next/image';
import { Fragment, useMemo, useState } from 'react';
// import { Activity } from './activity';
// import { CollectionFiltter, Filter } from './collection-fillter';
import { Activity } from './activity';
import { CollectionFiltter, Filter } from './collection-fillter';
// import { Sweep } from './sweep';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { CancelListing, PriceDialog } from './price-dialog';
import { useContract } from '@/hooks/use-contract';
import { DataTable } from '@/components/data-table';
import { columns } from './column';
import { CollectionMetadata } from '@/types';
type Props = {
	address: string;
};
export const TokenList = ({ address }: Props) => {
	const { account } = useContract();
	const [filter, setFilter] = useState<Filter & { tokenId?: string }>({});
	const debounceFilter = useDebounce(filter, 1000);
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const [view, setView] = useState<TViewMode>('GRID');
	const {
		data: userNfts = [],
		isFetching,
		refetch,
	} = api.userProfile.getUserNfts.useQuery({
		userAddress: address,
		...removeEmptyValues(debounceFilter),
	});

	const collectionFilter = useMemo(
		() => (
			<CollectionFiltter
				onFilterChange={(filter) => {
					if (Object.keys(filter).length === 0) {
						setFilter({});
					}
					setFilter((state) => ({ ...state, ...filter }));
				}}
			/>
		),
		[]
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
								<ChakraTab>Owned</ChakraTab>
								<ChakraTab>Bids</ChakraTab>
								<ChakraTab>Offers</ChakraTab>
								<ChakraTab>Activity</ChakraTab>
							</TabList>
							<RefreshButton
								className="mx-4"
								isLoading={isFetching}
								onClick={() => refetch()}
							/>
							<Input
								disabled={!filter.collectionAddress}
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
					<Select>
						<SelectTrigger className="w-[265px] uppercase border">
							<SelectValue placeholder="Sort" />
						</SelectTrigger>
						<SelectContent className="uppercase p-0">
							<SelectGroup>
								<SelectItem value="1">Rank: High To Low</SelectItem>
								<SelectItem value="2">Rank: Low To High</SelectItem>
								<SelectItem value="3">ID: High To Low</SelectItem>
								<SelectItem value="4">ID: Low To High</SelectItem>
								<SelectItem value="5">Price: High To Low</SelectItem>
								<SelectItem value="6">Price: Low To High</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
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
										{/* @ts-ignore */}
										{userNfts.map((collection, key) => {
											// @ts-ignore
											return collection.map((token) => (
												<CollectionTokenCard
													token={{
														total_supply: (
															token?.collection?.metadata as CollectionMetadata
														)?.totalSupply,
														active:
															token.latestActivity?.activity?.active ?? false,
														address: token.collection.address,
														attributes: JSON.stringify({}),
														collection_id: token.collectionId,
														id: token.id,
														image: token.image,
														name: token.name,
														price: token.latestActivity?.activity?.price ?? '0',
														created_at: token.createdAt,
														updated_at: token.updatedAt,
														listingId:
															token.latestActivity?.activity?.listingId ?? '',
														metadata: token.metadata as any,
														rarity: token.rarity as any,
														token_id: token.tokenId,
														seller:
															token.latestActivity?.activity?.seller ?? '',
														type: token.latestActivity?.activity?.type as any,
													}}
													key={key}
													buttonElement={
														address?.toLowerCase() ===
														account?.toLowerCase() ? (
															token.latestActivity?.activity?.active ? (
																<CancelListing
																	listingId={
																		token.latestActivity?.activity.listingId!
																	}
																/>
															) : (
																<PriceDialog
																	address={token.collection.address}
																	tokenId={token.tokenId}
																/>
															)
														) : null
													}
												/>
											));
										})}
									</div>
								) : (
									// @ts-ignore
									userNfts.map(
										(collection) =>
											collection.length !== 0 && (
												<Fragment>
													<h3 className="text-2xl font-heading uppercase">
														{
															(collection?.[0]?.collection?.metadata as any)
																?.name
														}
													</h3>
													{/* @ts-ignore */}
													<DataTable
														columns={columns}
														data={collection}
														manualPagination
													/>
												</Fragment>
											)
									)
								)}
							</div>
						</div>
					</TabPanel>
					<TabPanel className="!p-0">
						<h1>Not found</h1>
					</TabPanel>
					<TabPanel className="!p-0">
						<h1>Not found</h1>
					</TabPanel>
					<TabPanel className="!p-0">
						<Activity userAddress={address} />
					</TabPanel>
				</TabPanels>
			</ChakraTabs>
		</Fragment>
	);
};
