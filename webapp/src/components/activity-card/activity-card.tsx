'use client';
import { Card } from '@/components/ui/card';
import { useFormatCurrency } from '@/hooks/use-format-currency';
import { formatTokenName, shortenAddress } from '@/lib/utils';
import { Activity } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { TimeAgo } from '../time-ago';
import { Fragment } from 'react';

interface ActivityCardProps {
	activity: Activity;
}

export const ActivityCard = ({ activity }: ActivityCardProps) => {
	const format = useFormatCurrency();

	return (
		<Card className="p-3">
			<div className="grid sm:grid-cols-4 grid-cols-3 gap-4 items-center w-full">
				<Link
					href={`/collection/${activity.contractAddress}/${activity.tokenId}`}
					className="flex md:flex-row flex-col gap-2 md:items-center"
				>
					<section className="overflow-hidden rounded-lg md:size-16 size-10 flex items-center relative">
						{activity.collectionToken?.image && (
							<Image
								src={activity.collectionToken?.image}
								alt=""
								width={100}
								height={100}
							/>
						)}
						<span className="absolute top-0 right-0">
							<ICON />
						</span>
					</section>
					<section className="uppercase hover:underline text-gray-500 md:text-base text-sm font-heading font-extrabold">
						<h3>
							{formatTokenName(
								activity.collectionToken?.name!,
								activity.tokenId
							)}
						</h3>
					</section>
				</Link>
				<section className="space-y-2">
					<h3 className=" font-heading  text-base font-bold capitalize  flex items-center gap-x-1 text-black dark:text-white">
						<span className="capitalize icon-[mdi--thunder-outline] text-primary text-2xl"></span>{' '}
						{activity.type.toLowerCase()}
					</h3>
					<div className="flex items-center gap-x-1">
						<span className="text-gray-500 text-xs ">
							<TimeAgo datetime={activity.createdAt} />
						</span>
						<span className="icon-[system-uicons--external] text-gray-500 "></span>
					</div>
				</section>

				<section className="flex xl:flex-row flex-col gap-3 xl:items-center">
					<div className="flex items-center gap-2">
						<div className="overflow-hidden rounded-sm size-6">
							<Image src="/img/slide-logo.png" alt="" width={24} height={24} />
						</div>
						<h3 className="w-[calc(100%_-_24px)] truncate">
							{shortenAddress(activity.seller)}
						</h3>
					</div>
					{activity.type === 'SOLD' && (
						<Fragment>
							<h1 className="text-sm text-slate-500">From</h1>
							<div className="flex items-center gap-2">
								<div className="overflow-hidden rounded-sm size-6">
									<Image
										src="/img/slide-logo.png"
										alt=""
										width={24}
										height={24}
									/>
								</div>
								<h3 className="w-[calc(100%_-_24px)] truncate">
									{shortenAddress(activity.seller)}
								</h3>
							</div>
						</Fragment>
					)}
				</section>
				<div className=" flex-col justify-center items-end sm:flex hidden">
					<h3 className="font- font-bold text-gray-500 whitespace-nowrap">
						{format(Number(activity.price), 'SEI', 'name')}
					</h3>
					{/* <span className="font-heading font-extralight text-gray-500">{format(3, "USD", "symbol")}</span> */}
				</div>
			</div>
		</Card>
	);
};

function ICON() {
	return (
		<svg
			viewBox="0 0 24 24"
			focusable="false"
			className="chakra-icon css-zkos7u"
		>
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="#7489F7"
				xmlns="http://www.w3.org/2000/svg"
			>
				<rect width="24" height="24" rx="12" fill="#7489F7"></rect>
				<path
					d="M12.6667 5.33325L6.72898 12.4585C6.49644 12.7375 6.38017 12.8771 6.37839 12.9949C6.37685 13.0973 6.4225 13.1948 6.50218 13.2592C6.59384 13.3333 6.77546 13.3333 7.1387 13.3333H12L11.3333 18.6666L17.271 11.5413C17.5036 11.2623 17.6198 11.1228 17.6216 11.0049C17.6232 10.9025 17.5775 10.805 17.4978 10.7407C17.4062 10.6666 17.2246 10.6666 16.8613 10.6666H12L12.6667 5.33325Z"
					stroke="white"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				></path>
			</svg>
		</svg>
	);
}
