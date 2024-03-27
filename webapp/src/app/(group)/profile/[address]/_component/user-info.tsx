import { Icons } from '@/components/icons';
import { SocialGrid } from '@/components/social-grid';
import { shortenAddress } from '@/lib/utils';
import { Collection, CollectionMetadata } from '@/types';
import Link from 'next/link';

export const UserInfo = ({ userAddress }: { userAddress: string }) => {
	return (
		<div>
			<h1 className="flex items-center gap-x-2 text-4xl font-bold dark:text-white">
				{shortenAddress(userAddress)}
				<span className="icon-[ic--sharp-verified] text-green-600 text-2xl "></span>
			</h1>
			<p className="text-base text-slate-500 flex items-center gap-1 dark:text-white">
				<Link href={''} className="hover:underline inline-flex gap-2">
					<Icons.vtru /> <span>{shortenAddress(userAddress)}</span>
				</Link>
			</p>
		</div>
	);
};
