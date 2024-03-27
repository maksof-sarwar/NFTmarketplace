import { formatTokenName } from '@/lib/utils';
import { api } from '@/trpc/server';
import { CollectionMetadata } from '@/types';
import Image from 'next/image';
import { RedirectType, permanentRedirect } from 'next/navigation';
import { Activity } from './_component/activity';
import { CollectionName } from './_component/collection-name';
import { DetailsTabs } from './_component/details-tabs';
import { TokenDetail } from './_component/token-details';
import { OtherTokens } from './_component/other-tokens';

type Props = {
	params: any;
	searchParams: any;
};

export default async ({ params }: Props) => {
	const tokenId = params.id as string;
	const address = params.slug as string;
	const token = await api.collectionToken.getCollectionTokensByTokenId({
		tokenId,
		address,
	});
	if (!token) {
		return permanentRedirect(`/collection/${address}`, RedirectType.replace);
	}
	// @ts-ignore
	const metadata = token!.collection?.metadata as CollectionMetadata;
	const activity = token?.latestActivity?.activity;
	return (
		<div>
			<div className="grid lg:grid-cols-2 grid-cols-1  lg:gap-10">
				<aside>
					<div className="mb-7">
						<Image
							quality={70}
							src={token.image}
							width={800}
							height={800}
							alt=""
							className="rounded-xl w-full"
						/>
					</div>
					{/* @ts-ignore */}
					<DetailsTabs token={token} metadata={metadata} />
				</aside>
				<aside className="lg:mt-0 mt-10 space-y-8">
					{/* @ts-ignore */}
					<CollectionName token={token} metadata={metadata} />
					<h1 className="text-3xl capitalize font-thin my-3 dark:text-white">
						{formatTokenName(metadata.name, token.tokenId)}
					</h1>
					{/* @ts-ignore */}
					<TokenDetail activity={activity} metadata={metadata} token={token} />
					<Activity
						address={token.collection.address}
						tokenId={token.tokenId}
					/>
				</aside>
			</div>
			<OtherTokens />
		</div>
	);
};
