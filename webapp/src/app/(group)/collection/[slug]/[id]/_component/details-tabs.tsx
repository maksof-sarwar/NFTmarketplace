'use client';
import CONTRACT from '@/../contract';
import {
	ChakraTab,
	ChakraTabs,
	TabList,
	TabPanel,
	TabPanels,
} from '@/components/chakra-tabs';
import { NoRecordFound } from '@/components/no-record-found';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { formatNumber, shortenAddress } from '@/lib/utils';
import { CollectionMetadata } from '@/types';
import { RouterOutputs } from '@marketplace/api';
import React from 'react';

interface Props {
	token: RouterOutputs['collectionToken']['getCollectionTokensByTokenId'];
	metadata: CollectionMetadata;
}
export const DetailsTabs: React.FC<Props> = ({ token, metadata }) => {
	const address = token!.collection.address;
	const attributes = token!.attributes;
	const description = metadata.description;
	const tokenId = token!.tokenId;
	// @ts-ignore
	const allTrait = (token!.collection.traits as any)?.['allTrait'] ?? {};

	return (
		<ChakraTabs variant="unstyled">
			<div className="flex justify-between py-6">
				<TabList className="gap-3 grid grid-cols-2 md:grid-cols-4">
					<ChakraTab>Traits</ChakraTab>
					<ChakraTab>Bids</ChakraTab>
					<ChakraTab>Description</ChakraTab>
					<ChakraTab>Details</ChakraTab>
				</TabList>
			</div>
			<TabPanels>
				<TabPanel className="!p-0">
					<div className="space-y-4">
						{!attributes || attributes?.length === 0 ? (
							<NoRecordFound title="No traits found" />
						) : (
							<div className="grid 2xl:grid-cols-3 xl:grid-cols-2 lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
								{/* @ts-ignore */}
								{attributes?.map((attribute: any, idx) => {
									const traitCount = attribute.traitCount;
									const totalTraitCount =
										allTrait?.[attribute.trait_type]?.[attribute.value] ?? 0;
									return (
										<Card key={idx}>
											<CardContent className="px-2  py-3">
												<section className="flex flex-col p-3 gap-y-2 text-sm uppercase">
													<div className="inline-flex justify-between">
														<h3 className="text-sm">{attribute.trait_type}</h3>
														<span className="text-pretty line-clamp-1">
															{attribute.value}
														</span>
													</div>

													<div className="flex justify-between font-san font-thin">
														<h3 className=" text-sm">QTY</h3>
														<span>
															{formatNumber(totalTraitCount)}/{traitCount}
														</span>
													</div>
													<div className="flex justify-between font-san font-thin">
														<h3 className=" text-sm">RARITY</h3>
														<span>
															{((totalTraitCount / traitCount) * 100).toFixed(
																2
															)}{' '}
															%
														</span>
													</div>
												</section>
											</CardContent>
										</Card>
									);
								})}
							</div>
						)}
					</div>
				</TabPanel>
				<TabPanel className="!p-0">
					<Card className="p-5 space-y-4">
						<h1 className="text-2xl font-bold">Bids</h1>
						<p>No Bids on this NFT yet.</p>
					</Card>
				</TabPanel>
				<TabPanel className="!p-0">
					<Card className="p-5 space-y-4">
						<h1 className="text-2xl font-bold">Description</h1>
						<p>{description ?? 'N/A'}</p>
						<hr />
						{/*<SocialGrid
		 				className="flex items-center gap-4"
		 				metadata={token.collection?.metadata!}
		 			/>*/}
					</Card>
				</TabPanel>
				<TabPanel className="!p-0">
					<Card className="p-5 space-y-4">
						<h1 className="text-2xl font-bold">Details</h1>
						<Table>
							<TableBody>
								<TableRow>
									<TableCell className="text-left">
										<span className="font-heading">Contract Address</span>
									</TableCell>
									<TableCell className="text-right">
										<span className="font-bold">{shortenAddress(address)}</span>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="text-left">
										<span className="font-heading">Token ID</span>
									</TableCell>
									<TableCell className="text-right">
										<span className="font-bold">{tokenId}</span>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="text-left">
										<span className="font-heading">Token Standard</span>
									</TableCell>
									<TableCell className="text-right">
										<span className="font-bold">{CONTRACT.name}</span>
									</TableCell>
								</TableRow>
								<TableRow>
									<TableCell className="text-left">
										<span className="font-heading">Blockchain</span>
									</TableCell>
									<TableCell className="text-right">
										<span className="font-bold">{CONTRACT.name}</span>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</Card>
				</TabPanel>
			</TabPanels>
		</ChakraTabs>
	);
};
