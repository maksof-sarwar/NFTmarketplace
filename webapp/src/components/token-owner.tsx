'use client';
import { useTokenHolderCount } from '@/hooks/use-token-holder-count';
import { cn, formatNumber } from '@/lib/utils';
import { Spinner } from './pending';
import { Component, ComponentProps } from 'react';
import { RefreshButton } from './ui/button';

interface OwnerProps extends ComponentProps<'div'> {
	address: string;
}

export function Owner({ address, className, ...props }: OwnerProps) {
	const { loading, owner } = useTokenHolderCount(address);
	return (
		<div
			className={cn(className, 'inline-flex items-center dark:text-white')}
			{...props}
		>
			{loading ? (
				<RefreshButton isLoading className="w-4" />
			) : (
				formatNumber(owner)
			)}
		</div>
	);
}
