'use client';
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { Icons } from '../icons';

const buttonVariants = cva(
	'inline-flex items-center  uppercase justify-center whitespace-nowrap rounded-md text-sm font-sans font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/90',
				destructive:
					'bg-destructive text-destructive-foreground hover:bg-destructive/90',
				outline:
					'border  border-primary bg-background hover:bg-input text-primary',
				secondary:
					'bg-white text-white-foreground hover:bg-background border dark:bg-card dark:border-border dark:text-white dark:hover:bg-primary dark:hover:!border-primary dark:hover:text-white',
				ghost: 'hover:bg-accent hover:text-accent-foreground dark:text-white',
				link: 'text-primary underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-11 px-6 py-1',
				sm: 'h-9 rounded-md px-3',
				lg: 'h-11 rounded-md px-8',
				icon: ' w-[56px] h-11',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			isLoading = false,
			disabled,
			variant,
			size,
			asChild = false,
			...props
		},
		ref
	) => {
		const Comp = asChild ? Slot : 'button';
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				disabled={isLoading || disabled}
				{...props}
			>
				<div className="flex  items-center  justify-center gap-2">
					{isLoading ? (
						size === 'icon' ? (
							<Icons.refresh
								className={cn(
									'w-6 cursor-pointer',
									isLoading ? 'animate-spin' : '',
									className
								)}
							/>
						) : (
							'Loading...'
						)
					) : (
						props.children
					)}
				</div>
			</Comp>
		);
	}
);
Button.displayName = 'Button';

export { Button, buttonVariants };

interface RefreshButtonProps extends React.ComponentProps<'svg'> {
	isLoading?: boolean;
}

export const RefreshButton = ({
	isLoading,
	className,
	...props
}: RefreshButtonProps) => {
	return (
		<button className="cursor-pointer">
			<Icons.refresh
				className={cn(
					'w-6 cursor-pointer',
					isLoading ? 'animate-spin' : '',
					className
				)}
				{...props}
			/>
		</button>
	);
};
