import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
	'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
	{
		variants: {
			variant: {
				default:
					'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
				secondary:
					'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
				destructive:
					'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
				outline: 'text-foreground',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
);

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
	return (
		<div className={cn(badgeVariants({ variant }), className)} {...props} />
	);
}

export { Badge, badgeVariants };

interface RankBadgeProps extends BadgeProps {
	rank: number;
	totalSupply: number;
}
export const RankBadge = ({
	children,
	rank,
	totalSupply,
	className,
	...props
}: RankBadgeProps) => {
	const rankColor = React.useMemo(() => {
		const percent = (Number(rank) / Number(totalSupply)) * 100;
		if (percent <= 0.01) {
			return 'bg-[#FFCC66] hover:bg-[#FFCC66]/80';
		} else if (percent <= 0.05) {
			return 'bg-[#00FF33] hover:bg-[#00FF33]/80';
		} else if (percent <= 10) {
			return 'bg-[#33CCFF] hover:bg-[#33CCFF]/80';
		} else {
			return 'bg-[#743eed] hover:bg-[#743eed]/80';
		}
	}, [rank, totalSupply]);
	return (
		<Badge
			className={cn('rounded cursor-default', className, rankColor)}
			{...props}
		>
			RANK # {rank}
		</Badge>
	);
};
