import { Header } from '@/components/layout/header';
import { SiteFooter } from '@/components/layout/site-footer';
import { Notification } from '@/components/notification';
import { ThemeSwitcher } from '@/components/theme-swicher';
import React, { Fragment } from 'react';

export default ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return (
		<Fragment>
			<Header />
			<div className="flex flex-col min-h-[calc(100vh_-_192px)] pt-[2px]">
				<main className="pb-20 flex items-start gap-x-4 xl:mr-8 xl:ml-20 lg:mx-18 md:mx-10 mx-5">
					<div className="w-[calc(100%_-_73px)]">{children}</div>
					<div className="w-12 space-y-2">
						<Notification />
						<ThemeSwitcher className="md:flex" />
					</div>
				</main>
			</div>
			<SiteFooter />
		</Fragment>
	);
};
