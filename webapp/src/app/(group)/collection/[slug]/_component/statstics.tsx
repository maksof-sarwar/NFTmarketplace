'use client';
import { Currency } from '@/components/currency';
import { Icons } from '@/components/icons';
import { SocialGrid } from '@/components/social-grid';
import { Owner } from '@/components/token-owner';
import { buttonVariants } from '@/components/ui/button';
import { CardContent, Card } from '@/components/ui/card';
import { cn, shortenAddress } from '@/lib/utils';
import { RouterOutputs } from '@marketplace/api';
import Image from 'next/image';
import React from 'react';
import { data } from 'tailwindcss/defaultTheme';

interface StatsticsProps {
	collection: RouterOutputs['collection']['getCollectionStats'];
}
export const Statstics1 = ({ collection }: StatsticsProps) => {
	if (!collection) {
		return null;
	}
	return (
		<Card className="bg-black/50 2xl:max-w-[240px] max-w-[212px] w-full">
			<CardContent className="p-0  relative ">
				<Icons.dot className="text-2xl absolute left-3 top-3"></Icons.dot>
				<Image
					src={collection.logo}
					alt="logo"
					className="overflow-hidden rounded-md w-full aspect-square 2xl:max-h-[230px] max-h-[197px]"
					width={250}
					height={250}
				/>
				<div className="flex flex-col justify-between   uppercase text-white">
					<section className="grid grid-rows-4 p-3 gap-y-3">
						<div className="flex justify-between">
							<h3 className="font-heading text-xs">Contract</h3>
							<span className="text-gray-300 text-xs font-sans">
								{shortenAddress(collection.address)}
							</span>
						</div>
						<div className="flex justify-between">
							<h3 className="font-heading text-xs">Creator</h3>
							<span className="text-gray-300 text-xs font-sans">
								{shortenAddress(collection.metadata.creatorAddress)}
							</span>
						</div>
						<div className="flex justify-between">
							<h3 className="font-heading text-xs">Royality</h3>
							<span className="text-gray-300 text-xs font-sans">5%</span>
						</div>

						<div className="flex justify-between">
							<h3 className="font-heading text-xs">Chain</h3>
							<span className="text-gray-300 text-xs font-sans">VITRUVERO</span>
						</div>
					</section>
					<SocialGrid metadata={collection.metadata} />
				</div>
			</CardContent>
		</Card>
	);
};

export const Statstics2 = ({ collection }: StatsticsProps) => {
	if (!collection) {
		return null;
	}
	return (
		<Card className="bg-black/50 2xl:max-w-[212px] max-w-[212px] w-full text-white text-xs uppercase">
			<CardContent className="p-0 h-[190px]">
				<section className="grid grid-rows-6 p-3 gap-y-[10px]">
					<div className="flex justify-between">
						<h3 className="font-heading ">FLOOR</h3>
						<Currency
							value={collection.floorPrice}
							iconClassName="text-white"
							className="text-gray-300"
						/>
					</div>
					<div className="flex justify-between">
						<h3 className="font-heading ">24 HR VOL</h3>
						<Currency
							value={collection.volume_24h}
							iconClassName="text-white"
							className="text-gray-300"
						/>
					</div>
					<div className="flex justify-between">
						<h3 className="font-heading ">Total VOL</h3>
						<Currency
							value={collection.volume}
							iconClassName="text-white"
							className="text-gray-300"
						/>
					</div>

					<div className="flex justify-between">
						<h3 className="font-heading ">Owners</h3>
						<Owner
							address={collection.address}
							className="text-gray-300  font-sans"
						/>
					</div>
					<div className="flex justify-between">
						<h3 className="font-heading ">Supply</h3>
						<span className="text-gray-300  font-sans">
							{collection.metadata.totalSupply}
						</span>
					</div>
					<div className="flex justify-between">
						<h3 className="font-heading ">LISTED</h3>
						<span className="text-gray-300  font-sans">VITRUVERO</span>
					</div>
				</section>
			</CardContent>
		</Card>
	);
};
