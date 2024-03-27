'use client';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { Fragment } from 'react';

export default () => {
	return (
		<Fragment>
			<div className="flex min-h-screen items-center justify-center bg-background py-48 uppercase font-heading">
				<div className="flex flex-col">
					<div className="flex flex-col items-center">
						<div className="text-7xl font-heading font-bold text-primary">
							404
						</div>
						<div className="mt-10 text-3xl font-bold md:text-5xl lg:text-6xl xl:text-7xl">
							This page does not exist
						</div>
						<div className="mt-8 text-sm font-medium text-gray-400 md:text-xl lg:text-2xl">
							The page you are looking for could not be found.
						</div>
						<Link href="/" className={buttonVariants({ variant: 'link' })}>
							Go to Home
						</Link>
					</div>
				</div>
			</div>
		</Fragment>
	);
};
