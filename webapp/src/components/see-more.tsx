import { cn } from '@/lib/utils';
import Link from 'next/link';
import React, { ComponentProps } from 'react';
import { buttonVariants } from './ui/button';

interface SeeMoreProps extends ComponentProps<typeof Link> {}

const SeeMore = ({ href, className }: SeeMoreProps) => {
	return <Link href={href} className={cn(buttonVariants(), className)}></Link>;
};

export default SeeMore;
