import { ThemeProvider } from '@/components/layout/theme-provider';
import { RainbowProvider } from '@/components/rainbowkit-provider';
import { cn } from '@/lib/utils';
import '@rainbow-me/rainbowkit/styles.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

import { ChakraProvider } from '@/components/layout/chakra-provider';
import { ContractProvider } from '@/hooks/use-contract';
import { ToastContainer } from '@/lib/toast';
import { TRPCReactProvider } from '@/trpc/react';
import { headers } from 'next/headers';
import { cache } from 'react';

const fontSans = localFont({
	src: '../fonts/body.ttf',
	variable: '--font-sans',
	preload: true,
});
const fontHeading = localFont({
	src: '../fonts/heading.ttf',
	variable: '--font-heading',
	preload: true,
});
export const metadata: Metadata = {
	title: 'Honcho NFT Marketplace',
	description: 'Honcho NFT Marketplace',
};

const getHeaders = cache(async () => headers());
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={cn(
					'bg-background font-sans font-medium antialiased text-primary',
					fontSans.variable,
					fontHeading.variable
				)}
				suppressHydrationWarning
				suppressContentEditableWarning
			>
				<TRPCReactProvider headersPromise={getHeaders()}>
					<ContractProvider>
						<ThemeProvider>
							<ChakraProvider>
								<RainbowProvider>
									{children}
									<ToastContainer />
								</RainbowProvider>
							</ChakraProvider>
						</ThemeProvider>
					</ContractProvider>
				</TRPCReactProvider>
			</body>
		</html>
	);
}
