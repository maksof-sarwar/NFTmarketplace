import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { api } from '@/trpc/server';
import React, { Fragment, Suspense } from 'react';
import { redirect } from 'next/navigation';
import { Button, RefreshButton } from '@/components/ui/button';
import Image from 'next/image';
import { ChakraTab, ChakraTabs, TabList } from '@/components/chakra-tabs';
import { TokenList } from './_component/token-list';
import { Statstics } from './_component/statstics';
type Props = {
	params: any;
	searchParams: any;
};
export default async ({ params }: Props) => {
	const userAddress = params.address;
	if (!userAddress) {
		return redirect('/');
	}

	return (
		<div className="space-y-8 k pt-16">
			<Card
				style={{
					backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(255, 255, 255, 0)), url(/svg/profile-default-background.svg)`,
				}}
				className={cn(
					'sm:max-h-[440px] max-h-[300px]  relative  h-screen block      bg-cover bg-no-repeat bg-center'
				)}
			>
				<CardContent
					className={cn(
						'rounded-md  pb-5 pl-2 gap-x-4 relative object-cover flex items-end h-full w-full'
					)}
				>
					<Statstics userAddress={userAddress} />
				</CardContent>
			</Card>
			<TokenList address={userAddress} />
		</div>
	);
};
