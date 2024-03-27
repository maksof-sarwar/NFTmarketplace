import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { ComponentProps } from 'react';

interface LogoProps extends Omit<ComponentProps<typeof Link>, 'href'> {}
export const Logo = ({ className, ...props }: LogoProps) => {
	return (
		<Link href="/" {...props}>
			<Image
				src="/svg/logo.svg"
				alt="logo"
				className={cn('w-40', className)}
				width={100}
				height={100}
			/>
		</Link>
	);
};
