import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { cn, formatTokenName, roundNumber } from '@/lib/utils';
import {
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Slider,
	SliderFilledTrack,
	SliderThumb,
	SliderTrack,
} from '@chakra-ui/react';
import Image from 'next/image';

import { Currency } from '@/components/currency';
import { DataTable } from '@/components/data-table';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { TViewMode, ViewMode } from '@/components/view-mode';
import { useContract } from '@/hooks/use-contract';
import { toast } from '@/lib/toast';
import { removeEmptyValues } from '@/lib/utils';
import { api } from '@/trpc/react';
import { CollectionTokens } from '@/types';
import { Prisma, type Activity } from '@marketplace/db';
import { useDebounce } from '@uidotdev/usehooks';
import Link from 'next/link';
import { Fragment, useCallback, useMemo, useState } from 'react';
import { CollectionFiltter, Filter } from './collection-fillter';
import { columns } from './column';

export const CollectionTokenList = ({
	address,
	traits,
}: {
	traits: Prisma.JsonValue;
	address: string;
}) => {
	const [orderby, setOrderBy] = useState<'RARITY' | 'NONE'>('RARITY');
	const [filter, setFilter] = useState<Filter & { tokenId?: string }>({});
	const debounceFilter = useDebounce(filter, 1000);
	const {
		data: collectionTokens = [],
		refetch,
		isFetching,
	} = api.collectionToken.getCollectionTokens.useQuery<CollectionTokens[]>({
		address,
		...removeEmptyValues(debounceFilter),
	});
	const { exec, web3 } = useContract();
	const [sweep, setSweep] = useState<
		Array<Pick<Activity, 'listingId' | 'price' | 'tokenId'>>
	>([]);
	const [view, setView] = useState<TViewMode>('GRID');
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const activeTokens = useMemo(
		() =>
			collectionTokens
				.filter((a) => a.active)
				.map((a) => {
					const { listingId, price, token_id } = a!;
					return {
						listingId,
						price,
						tokenId: token_id,
					};
				}),
		[collectionTokens]
	);
	console.log('activeTokens,', activeTokens);
	const sweepBuy = useCallback(async () => {
		try {
			const listingIds = sweep.map((token) => token.listingId);
			const totalPrice = sweep
				.reduce((p, c) => p + Number(c.price), 0)
				.toString();
			const firstListingId = listingIds[0];
			const firstListing = await exec('listings', 'call', {}, firstListingId);
			if (!firstListing.active) {
				throw new Error('At least one of the listed NFTs is not active.');
			}
			const tx = await exec(
				'sweepNFT',
				'send',
				{
					value: web3?.utils.toWei(totalPrice, 'ether'),
				},
				address,
				listingIds
			);
			if (tx) {
				toast({
					status: 'success',
					description: 'Successfully buy: tx is' + tx?.transactionHash,
				});
			}
		} catch (error: any) {
			toast({
				status: 'error',
				description: 'Error sweeping NFTs:' + error.message,
			});
		}
	}, [sweep]);
	const collectionFilter = useMemo(
		() => (
			<CollectionFiltter
				traits={traits}
				onFilterChange={(filter) => {
					setFilter((state) => ({ ...state, ...filter }));
				}}
			/>
		),
		[traits]
	);
	return (
		<Fragment>
			<div className="grid lg:grid-cols-4 md:grid-cols-2 gap-2">
				<div className="flex items-center justify-between">
					<Button
						variant={'secondary'}
						size={'lg'}
						className="text-base md:block hidden font-semibold"
						onClick={() => setIsVisible(!isVisible)}
					>
						<span className="icon-[ion--filter] mr-1 "></span>
						Filter
					</Button>
					<div className="md:hidden block">
						<Sheet>
							<SheetTrigger>
								<Button
									variant={'secondary'}
									size={'icon'}
									className="text-base font-semibold"
								>
									<span className="icon-[ion--filter]"></span>
								</Button>
							</SheetTrigger>
							<SheetContent side={'left'} className="w-full sm:max-w-full">
								<SheetHeader>
									<SheetTitle className="text-left text-2xl">
										Filter Options
									</SheetTitle>
								</SheetHeader>
								{collectionFilter}
							</SheetContent>
						</Sheet>
					</div>
					<h1 className="items-center gap-x-2 font-bold text-base md:flex hidden dark:text-white">
						<span className="size-6 bg-green-300 flex  rounded-full items-center justify-center">
							<span className="icon-[octicon--dot-fill-24] text-2xl text-green-700"></span>
						</span>{' '}
						{collectionTokens?.length ?? 0} Results
					</h1>
				</div>
				<div className="col-span-2 lg:order-none order-last flex items-centerm justify-between ">
					<div className="flex items-center gap-x-2 w-full lg:pl-11 pl-3">
						<span className="icon-[material-symbols--search] text-2xl -mr-11 text-slate-400"></span>
						<Input
							type="text"
							placeholder="Search"
							onChange={(e) => {
								setFilter({ ...filter, tokenId: e.currentTarget.value });
							}}
							className="w-full h-10 pl-10 rounded-sm border-none dark:border-dark !ring-0   bg-accent outline-none"
						/>
					</div>
					<Button
						size={'icon'}
						variant={'default'}
						onClick={() => refetch()}
						isLoading={isFetching}
					>
						<span className="icon-[basil--refresh-solid] text-2xl"></span>
					</Button>
				</div>
				<div className="flex items-center justify-between pl-11">
					<div className="flex items-center justify-between space-x-2 opacity-0">
						<Checkbox
							id="terms"
							className="rounded-[4px]"
							onCheckedChange={(check) => {
								setOrderBy((state) => (check ? 'RARITY' : 'NONE'));
							}}
						/>
						<label
							htmlFor="terms"
							className="text-sm whitespace-nowrap font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-white"
						>
							Sort by Rarity
						</label>
					</div>
					<ViewMode onViewModeChange={setView} defaultViewMode={view} />
				</div>
			</div>
			<Card className="p-3 rounded-t-none">
				<div className="flex md:flex-row flex-col md:items-center md:gap-0 gap-2 justify-between">
					<div className="flex items-center gap-x-4">
						<div className="flex items-center border-r py-1 pr-2">
							<span className="icon-[ph--paint-brush-household] text-primary text-lg mr-4"></span>
							<span className="text-base font-bold">Sweep</span>
						</div>
						<div className="w-[130px]">
							<Slider
								color="primary.main"
								step={10}
								aria-label="slider-ex-1"
								onChange={(value) => {
									const idx = value / 10;
									setSweep(activeTokens.slice(0, idx));
								}}
								value={sweep.length * 10}
							>
								<SliderTrack>
									<SliderFilledTrack bgColor="primary.main" />
								</SliderTrack>
								<SliderThumb>
									<span className="icon-[solar--soundwave-outline]"></span>
								</SliderThumb>
							</Slider>
						</div>
						<div className="max-w-[100px]">
							<NumberInput
								max={activeTokens?.length ?? 25}
								value={sweep.length}
								onChange={(e) => {
									const _value = Number(e);
									if (_value <= collectionTokens?.length) {
										return setSweep(activeTokens.slice(0, _value));
									}
									setSweep(activeTokens.slice(0, collectionTokens.length));
								}}
								className="dark:border-dark"
							>
								<NumberInputField />
								<NumberInputStepper>
									<NumberIncrementStepper className="dark:!border-dark dark:text-white" />
									<NumberDecrementStepper className="dark:border-dark dark:text-white" />
								</NumberInputStepper>
							</NumberInput>
						</div>
					</div>
					<Button disabled={sweep.length === 0} onClick={sweepBuy}>
						{sweep.length === 0
							? 'Buy Selected Items now'
							: `Buy ${sweep.length} Items for
						${roundNumber(sweep.reduce((p, c) => p + Number(c.price), 0))}`}
					</Button>
				</div>
			</Card>
			<div className="grid grid-cols-5 gap-2">
				{isVisible && (
					<div className="lg:col-span-1 md:col-span-2">
						<Card>{collectionFilter}</Card>
					</div>
				)}
				<div
					className={cn(isVisible ? 'lg:col-span-4 col-span-3' : 'col-span-5')}
				>
					{view == 'GRID' ? (
						<div
							className={cn(
								isVisible
									? 'xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1'
									: 'xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2',
								'grid grid-cols-1 gap-2'
							)}
						>
							{collectionTokens?.map((token, idx) => (
								<label
									key={idx}
									htmlFor={token.id}
									className={cn(
										sweep.findIndex((sw) => sw.tokenId === token.token_id) !==
											-1
											? 'border-primary'
											: 'border-transparent',
										'border-2 rounded-sm block'
									)}
								>
									<Card className="h-full flex flex-col justify-between group cursor-pointer dark:bg-[#1A202C]">
										<CardHeader className="p-1 relative">
											<Image
												className="rounded-sm group-hover:blur-[2px] w-full"
												src={token.image}
												width={250}
												height={250}
												alt=""
											/>
											{token.active && (
												<Checkbox
													id={token?.listingId?.toString()}
													checked={
														sweep.findIndex(
															(sw) => sw.tokenId === token.token_id
														) !== -1
													}
													onCheckedChange={(check) => {
														setSweep((state) => {
															const { listingId, token_id, price } = token;
															state = !check
																? state.filter(
																		(s) => s.tokenId !== token.token_id
																	)
																: [
																		...state,
																		{ listingId, tokenId: token_id, price },
																	];
															return state;
														});
													}}
													className="absolute top-3 left-3 z-10 rounded-[4px]"
												/>
											)}
											<Link
												href={{
													pathname: `/collection/${address}/${token.token_id}`,
													// query: { listingId: token.listingId },
												}}
												className={cn(
													buttonVariants({
														variant: 'secondary',
														className:
															'absolute top-[calc(50%_-_20px)] left-[calc(50%_-_45%)] w-[90%] hidden text-center group-hover:block dark:bg-white dark:!border-white dark:text-black',
													})
												)}
											>
												View in Detail
											</Link>
										</CardHeader>
										<CardContent className="p-1  h-[107px]">
											<div className="mb-3">
												<h1 className="text-base font-bold mb-0">
													{formatTokenName(token.name, token.token_id)}
												</h1>
												<Badge className="bg-slate-400">
													Rank {(token.rarity as any)?.rank ?? '0'}
												</Badge>
											</div>
											<div>
												<div className="flex items-center gap-x-[1px]">
													<Currency
														value={token?.price ?? '0'}
														isNotActive={!token?.active}
													/>
													{/* <span className="text-xs text-slate-500">
														($1,515.42)
													</span> */}
												</div>

												<span className="text-xs text-slate-500 flex items-center gap-x-2 -mt-[2px] ml-[4px]">
													Last Sale:
													<Currency
														value={token?.price ?? '0'}
														isNotActive={!token?.price}
													/>
												</span>
											</div>
										</CardContent>
									</Card>
								</label>
							))}
						</div>
					) : (
						// @ts-ignore
						<DataTable columns={columns} data={collectionTokens} />
					)}
				</div>
			</div>

			{/* <Button className="w-full mt-4">Load more (53)</Button> */}
		</Fragment>
	);
};
