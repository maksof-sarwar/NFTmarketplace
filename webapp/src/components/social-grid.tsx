import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CollectionMetadata } from '@/types';
import Link from 'next/link';
import { ComponentProps, FC } from 'react';

interface SocialGridProps extends ComponentProps<'div'> {
	metadata: CollectionMetadata;
}

export const SocialGrid: FC<SocialGridProps> = ({
	metadata,
	className,
	...props
}) => {
	console.log(metadata);
	return (
		<div className={cn('space-x-1 pt-4  text-white', className)} {...props}>
			<ButtonOrLink href={metadata.web}>
				<span className="icon-[ph--globe]"></span>
			</ButtonOrLink>
			<ButtonOrLink href={metadata.discord}>
				<span className="icon-[ic--baseline-discord]"></span>
			</ButtonOrLink>
			<ButtonOrLink href={metadata.twitter}>
				<span className="icon-[mdi--twitter]"></span>
			</ButtonOrLink>
		</div>
	);
};

function ButtonOrLink({
	href,
	children,
}: {
	href?: string;
	children: JSX.Element;
}) {
	if (href) {
		return (
			<Link
				href={href}
				target="_blank"
				className={cn(
					buttonVariants({
						size: 'icon',
						variant: 'link',
						className: 'text-2xl size-12 text-white',
					})
				)}
			>
				{children}
			</Link>
		);
	}

	return (
		<Button
			size="icon"
			className="text-2xl size-12 text-white"
			variant="link"
			disabled
		>
			{children}
		</Button>
	);
}
