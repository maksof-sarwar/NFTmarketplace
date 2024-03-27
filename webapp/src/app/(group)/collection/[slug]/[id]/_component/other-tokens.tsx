'use client';
import { CollectionTokenCard } from '@/components/collection-token-card';
import { Currency } from '@/components/currency';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from '@/components/ui/carousel';
import { cn, formatTokenName } from '@/lib/utils';
import { api } from '@/trpc/react';
import { CollectionTokens } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Fragment } from 'react';

export function OtherTokens() {
	const params = useParams();
	const address = params.slug as string;
	const { data: collection } = api.collection.getSlugFromAddress.useQuery({
		address,
	});
	const { data: otherTokens = [] } =
		api.collectionToken.getCollectionTokens.useQuery<CollectionTokens[]>({
			address,
			excludeTokenId: params.id as string,
			take: 10,
		});
	return (
		<Fragment>
			<hr className="border-b-2 mt-8" />
			<div className="py-8">
				<div className="flex items-center justify-between">
					<h1 className="md:text-3xl sm:text-2xl text-xl *:font-bold dark:text-white">
						More From This Collection
					</h1>
					<Link
						href={`/collection/${collection?.slug}`}
						className={cn(
							buttonVariants({ variant: 'outline' }),
							'uppercase font-sans font-thin px-10'
						)}
					>
						View Collection
					</Link>
				</div>
				<div className="pb-5 pt-3">
					<Carousel className="w-full">
						<CarouselContent className="-ml-1">
							{otherTokens.map((slide, index) => (
								<CarouselItem
									key={index}
									className="pl-1 group basis-1/1 sm:basis-1/2 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
								>
									<div className="p-1">
										<CollectionTokenCard token={slide} />
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
					</Carousel>
				</div>
			</div>
		</Fragment>
	);
}
