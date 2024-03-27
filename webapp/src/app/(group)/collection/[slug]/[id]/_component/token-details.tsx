'use client';
import { Currency } from '@/components/currency';
import { RankBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useContract } from '@/hooks/use-contract';
import { toast } from '@/lib/toast';
import { shortenAddress } from '@/lib/utils';
import { CollectionMetadata } from '@/types';
import { Badge } from '@chakra-ui/react';
import { RouterOutputs } from '@marketplace/api';
import { Activity } from '@marketplace/db';
import React, { useCallback } from 'react';

interface TokenDetailProps {
	activity: Activity | null | undefined;
	token: RouterOutputs['collectionToken']['getCollectionTokensByTokenId'];
	metadata: CollectionMetadata;
}

export const TokenDetail = ({
	activity,
	metadata,
	token,
}: TokenDetailProps) => {
	const { web3, exec, account } = useContract();
	const buyNft = useCallback(async () => {
		try {
			if (!activity) {
				throw new Error(`Invalid token`);
			}
			if (!isListing) {
				throw new Error(`NFT is not listed for sale.`);
			}
			const tx = await exec(
				'buyNFT',
				'send',
				{ value: web3?.utils.toWei(activity?.price, 'ether') },
				activity?.contractAddress,
				activity?.listingId
			);
			if (tx) {
				toast({
					status: 'success',
					description: `NFT bought successfully`,
				});
			}
		} catch (error: any) {
			toast({
				status: 'error',
				description: error.message,
			});
		}
	}, [activity]);
	const isListing = activity?.type === 'LISTING';
	const btnDisabled = !isListing || activity.seller === account;
	return (
		<Card className="bg-white dark:bg-card w-full grid 2xl:grid-cols-5 grid-cols-9 gap-3 p-4">
			<Card className=" bg-card/25 2xl:col-span-2 col-span-4">
				<CardContent className="px-2  py-3">
					<section className="flex flex-col p-3 gap-y-2 text-sm uppercase">
						<div className="flex justify-between font-heading ">
							<h3 className="text-sm">OWNED BY</h3>
							<span>
								{activity?.seller ? shortenAddress(activity?.seller) : '-'}
							</span>
						</div>

						<div className="flex justify-between font-heading">
							<h3 className=" text-sm">Created BY</h3>
							<span>{shortenAddress(metadata.creatorAddress)}</span>
						</div>
						<div className="flex justify-between font-heading">
							<h3 className=" text-sm">Rank</h3>
							<RankBadge
								rank={(token?.rarity as any)?.['rank']}
								totalSupply={
									(token?.collection.metadata as CollectionMetadata)
										?.totalSupply
								}
							/>
						</div>
						<div className="flex justify-between">
							<h3 className="font-heading text-sm">Views</h3>
							<span>25000</span>
						</div>
						<div className="flex justify-between">
							<h3 className="font-heading text-sm">Supply</h3>
							<span className="text-sm font-sans">{metadata.totalSupply}</span>
						</div>
						<div className="flex justify-between">
							<h3 className="font-heading text-sm">Chain</h3>
							<span className="text-sm font-sans">Vitruveo</span>
						</div>
					</section>
				</CardContent>
			</Card>
			<Card className="  bg-card/25 2xl:col-span-3 col-span-5">
				<CardContent className="px-2 h-full py-3">
					<section className="p-3 uppercase h-full flex flex-col justify-between gap-y-2">
						<span>
							<h3 className="font-heading">Current price</h3>
							<Currency
								className="text-4xl"
								iconClassName="size-8"
								value={activity?.price || 0}
								isNotActive={!isListing}
							/>
						</span>
						<Button
							className="font-heading w-full h-14"
							disabled={btnDisabled}
							onClick={buyNft}
						>
							{isListing ? 'Buy Now' : 'Nft not list for sale'}
						</Button>
						{/* <h1 className="flex justify-start gap-x-1 text-sm font-thin">
							Listing ends on:
							<span className="font-heading">
								{isListing ? 'March 25th 2024, 9:33:56 pm' : '-'}
							</span>
						</h1> */}
					</section>
				</CardContent>
			</Card>
		</Card>
	);
};
