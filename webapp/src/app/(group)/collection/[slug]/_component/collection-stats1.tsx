import { Currency } from '@/components/currency';
import { Icons } from '@/components/icons';
import { Card } from '@/components/ui/card';
import { useTokenHolderCount } from '@/hooks/use-token-holder-count';
import { Collection, CollectionMetadata } from '@/types';
import { useMemo } from 'react';

export const CollectionStats = ({
	collection,
	totalSupply,
}: {
	collection: Collection;
	totalSupply: number;
}) => {
	const { loading, owner } = useTokenHolderCount(collection.address);
	const metadata = collection.metadata as unknown as CollectionMetadata;
	console.log('collection.collectionTokens', collection.collectionTokens);
	const stats = useMemo(() => {
		const tokens = collection.collectionTokens
			.map((tokens) => tokens.latestActivity?.activity)
			?.filter((f) => f?.active)
			?.map((f) => Number(f?.price || 0));
		return {
			floorPrice: tokens.length === 0 ? 0 : Math.min(...tokens),
			volume: collection.collectionTokens?.reduce(
				(p, c) => p + c.activity.filter((f) => f.type === 'SOLD').length,
				0
			),
			totalVolume: collection.collectionTokens?.reduce(
				(p, c) => p + c.activity.filter((f) => f.type === 'SOLD').length,
				0
			),
			listed: collection.collectionTokens?.reduce(
				(p, c) => p + c.activity.filter((a) => a.type === 'LISTING').length,
				0
			),
		};
	}, [collection]);

	return (
		<div className="grid grid-cols-3 gap-2 max-w-[450px] w-full">
			<Card className="text-center p-3">
				<p className="md:text-base text-xs text-slate-500 mb-1">Floor Price</p>
				<h1 className="flex items-center justify-center gap-1 text-base font-bold">
					<Currency value={stats.floorPrice} />
				</h1>
			</Card>
			<Card className="text-center p-3">
				<p className="md:text-base text-xs text-slate-500 mb-1">Total Volume</p>
				<h1 className="flex items-center justify-center gap-1 md:text-base text-xs font-bold">
					<Currency value={stats.totalVolume} />
				</h1>
			</Card>
			<Card className="text-center p-3">
				<p className="md:text-base text-xs  text-slate-500 mb-1">24hr Volume</p>
				<h1 className="flex items-center justify-center gap-1 md:text-base text-xs font-bold">
					<Currency value={stats.volume} />
				</h1>
			</Card>
			<Card className="text-center p-3">
				<p className="md:text-base text-xs  text-slate-500 mb-1">Items</p>
				<h1 className="flex items-center justify-center gap-1 md:text-base text-xs font-bold">
					<Icons.diamond className="text-primary text-lg" />
					{metadata.totalSupply}
				</h1>
			</Card>
			<Card className="text-center p-3">
				<p className="md:text-base text-xs  text-slate-500 mb-1">Listed</p>
				<h1 className="flex items-center justify-center gap-1 md:text-base text-xs font-bold">
					<Icons.tags className="text-primary text-xl" />
					{stats.listed}
				</h1>
			</Card>
			<Card className="text-center p-3">
				<p className="md:text-base text-xs  text-slate-500 mb-1">Owners</p>
				<h1 className="flex items-center justify-center gap-1 md:text-base text-xs font-bold">
					<Icons.users className="text-primary text-xl" />
					{loading ? 'Loading...' : owner}
				</h1>
			</Card>
		</div>
	);
};
