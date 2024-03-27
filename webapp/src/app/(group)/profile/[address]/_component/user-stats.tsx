import { Card } from '@/components/ui/card';
import { useNftListing } from '@/hooks/use-contract';
import { formatNumber } from '@/lib/utils';
import { NftTokenMetadata } from '@/types';
import { useEffect, useState } from 'react';
import groupBy from 'lodash/groupBy';
interface UserStatsProps extends ReturnType<typeof useNftListing> {
	nftTokens: NftTokenMetadata[];
}

export const UserStats = ({
	listings,
	loading,
	nftTokens,
	refresh,
}: UserStatsProps) => {
	const [estValue, setEstValue] = useState(0);
	useEffect(() => {
		if (!loading) {
			const groups = groupBy(listings, 'nftContract');
			const total = Object.values(groups).reduce(
				(p, cur) => (p += Math.min(...cur.map((c) => Number(c.price)))),
				0
			);

			setEstValue(total / Object.keys(groups).length);
		}
	}, [listings, loading]);
	return (
		<div className="grid grid-cols-2 gap-2 max-w-[300px] w-full">
			<Card className="text-center p-3">
				<p className="md:text-base text-xs text-slate-500 dark:text-white mb-1">
					Owned
				</p>
				<h1 className="flex items-center justify-center gap-1 md:text-base text-xs font-bold">
					<span className="icon-[system-uicons--diamond] text-primary text-lg"></span>

					{nftTokens === undefined
						? 'Loading...'
						: formatNumber(nftTokens.length)}
				</h1>
			</Card>
			<Card className="text-center p-3">
				<p className="md:text-base text-xs  text-slate-500 dark:text-white mb-1">
					On Sale
				</p>
				<h1 className="flex items-center justify-center gap-1 md:text-base text-xs font-bold">
					<span className="icon-[system-uicons--diamond] text-primary text-lg"></span>
					{formatNumber(listings.filter((l) => l.active).length ?? 0)}
				</h1>
			</Card>
			<Card className="text-center p-3">
				<p className="md:text-base text-xs  text-slate-500 dark:text-white mb-1">
					Offers
				</p>
				<h1 className="flex items-center justify-center gap-1 md:text-base text-xs font-bold">
					<span className="icon-[system-uicons--diamond] text-primary text-lg"></span>
					0
					{/* {info?.['24hVolume'] === undefined
							? 'Loading...'
							: format(info?.['24hVolume'], 'SEI')} */}
				</h1>
			</Card>
			<Card className="text-center p-3">
				<p className="md:text-base text-xs  text-slate-500 dark:text-white mb-1">
					Esimated Value
				</p>
				<h1 className="flex items-center justify-center gap-1 md:text-base text-xs  font-bold">
					<span className="icon-[system-uicons--diamond] text-primary text-lg"></span>
					{loading ? 'Loading...' : formatNumber(estValue)}
				</h1>
			</Card>
		</div>
	);
};
