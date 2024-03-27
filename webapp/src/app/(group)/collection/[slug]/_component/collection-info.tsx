import { CopyToClipboard } from '@/components/copy-to-clipboard';
import { SocialGrid } from '@/components/social-grid';
import { shortenAddress } from '@/lib/utils';
import { Collection, CollectionMetadata } from '@/types';
import Link from 'next/link';

export const CollectionInfo = ({ collection }: { collection: Collection }) => {
	const metadata = collection.metadata as CollectionMetadata;
	return (
		<div>
			<h1 className="flex items-center gap-x-2 text-4xl font-bold dark:text-white">
				{metadata.name}
				<span className="icon-[ic--sharp-verified] text-green-600 text-2xl"></span>
			</h1>
			<p className="text-base text-slate-500 flex items-center gap-1">
				Contract:
				<Link href={''} className="hover:underline dark:text-white">
					{shortenAddress(collection.address)}
				</Link>{' '}
				<CopyToClipboard
					text={collection.address}
					className="dark:text-white"
				/>
			</p>
			<p className="text-base text-slate-500 flex items-center gap-1">
				Creator:
				<Link
					href={`/profile/${metadata.creatorAddress}`}
					className="hover:underline dark:text-white"
				>
					{shortenAddress(metadata.creatorAddress)}
				</Link>
				<CopyToClipboard
					text={metadata.creatorAddress}
					className="dark:text-white"
				/>
			</p>
			<p className="text-base text-slate-500 flex items-center gap-1">
				Royalty: <span className="dark:text-white">5%</span>
			</p>
			<h2 className="text-base pt-4 dark:text-white">{metadata.description}</h2>
			<SocialGrid metadata={metadata} />
		</div>
	);
};
