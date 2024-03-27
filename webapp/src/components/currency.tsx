'use client';
import { useFormatCurrency } from '@/hooks/use-format-currency';
import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';
import { Icons } from './icons';

interface CurrencyProps extends ComponentProps<'span'> {
	value: number | string;
	usd?: boolean;
	iconClassName?: string;
	isNotActive?: boolean;
}

export const Currency = ({
	value,
	className,
	usd = false,
	isNotActive = false,
	iconClassName,
}: CurrencyProps) => {
	const format = useFormatCurrency();
	return (
		<span
			className={cn(
				'inline-flex  items-center text-sm font-sans text-primary',
				className,
				usd ? 'gap-0' : 'gap-2'
			)}
		>
			<span className="dark:text-white whitespace-nowrap">
				{isNotActive ? '-' : format(Number(value))}
			</span>
			{usd ? (
				<span
					className={cn('size-4', iconClassName, 'icon-[mdi--dollar] ')}
				></span>
			) : (
				<Icons.vtru className={cn('size-4', iconClassName)} />
			)}
		</span>
	);
};
