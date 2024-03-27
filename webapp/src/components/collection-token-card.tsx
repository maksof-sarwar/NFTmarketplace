'use client';
import { Currency } from '@/components/currency';
import { Badge, RankBadge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn, formatTokenName, rankColor } from '@/lib/utils';
import { CollectionTokens } from '@/types';
import { Checkbox, CheckboxProps, Icon } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { Icons } from './icons';
import React from 'react';

interface CollectionTokenCardProps extends Pick<CheckboxProps, 'isChecked'> {
	token: CollectionTokens;
	shouldShowCheckbox?: boolean;
	onCheckboxChange?: (checked: boolean, token: CollectionTokens) => void;
	buttonElement?: React.ReactNode;
}

export const CollectionTokenCard = ({
	token,
	shouldShowCheckbox = false,
	buttonElement,
	...props
}: CollectionTokenCardProps) => {
	return (
		<label htmlFor={token.id}>
			<Card
				className={cn(
					'group cursor-pointer h-full bg-white dark:bg-input  transition-all ease-in-out duration-200',
					props.isChecked ? 'bg-card dark:bg-card' : ''
				)}
			>
				<CardHeader className="p-3 relative h-[calc(100%_-_145px)] flex items-center justify-center">
					<Image
						className="rounded h-full w-full group-hover:blur-[2px]"
						src={token.image}
						width={250}
						height={250}
						alt=""
					/>

					<div className="absolute uppercase space-y-4 font-heading  items-center justify-center h-full    w-full p-6 hidden group-hover:flex  flex-col">
						<Link
							href={`/collection/${token.address}/${token.token_id}`}
							className={cn(
								buttonVariants({
									variant: 'secondary',
									className:
										'w-full text-center px-2 font-heading dark:bg-white dark:text-black',
								})
							)}
						>
							View in Detail
						</Link>
						{buttonElement}
					</div>
					{shouldShowCheckbox && token.type === 'LISTING' && (
						<Checkbox
							border={0}
							colorScheme="white"
							bg={'white'}
							icon={<CustomIcon />}
							id={token?.id}
							className="absolute top-4 left-[24px] z-50 rounded-[4px]"
							onChange={(e) => {
								if (props.onCheckboxChange) {
									props.onCheckboxChange(e.target.checked, token);
								}
							}}
							{...props}
						/>
					)}
				</CardHeader>

				<CardContent className="p-3 h-[145px]">
					<div className="mb-4">
						<h1 className="font-heading mb-0">
							{formatTokenName(token.name, token.token_id)}
						</h1>
						<RankBadge
							rank={(token?.rarity as any)?.['rank']}
							totalSupply={token.total_supply}
						/>
					</div>
					<section className="uppercase flex flex-col gap-y-3">
						<div className="flex justify-between font-heading">
							<h3 className=" text-sm">Buy Now</h3>
							<Currency
								value={token?.price || 0}
								isNotActive={token.type !== 'LISTING'}
							/>
						</div>
						<div className="flex justify-between font-sans font-thin">
							<h3 className=" text-sm">Last sale</h3>
							<Currency
								value={token?.price ?? '0'}
								isNotActive={token.type === 'LISTING'}
							/>
						</div>
					</section>
				</CardContent>
			</Card>
		</label>
	);
};

function CustomIcon(props: any) {
	const { isIndeterminate, isChecked, ...rest } = props;

	return (
		<>
			{isChecked ? (
				<Icon viewBox="0 0 200 200" color="primary.DEFAULT" className="text-sm">
					<path
						fill="currentColor"
						d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
					/>
				</Icon>
			) : null}
		</>
	);
}
