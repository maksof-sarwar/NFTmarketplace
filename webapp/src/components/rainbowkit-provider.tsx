'use client';

import {
	RainbowKitProvider,
	Theme,
	connectorsForWallets,
	lightTheme,
	getDefaultWallets,
	darkTheme,
} from '@rainbow-me/rainbowkit';
import {
	argentWallet,
	ledgerWallet,
	trustWallet,
} from '@rainbow-me/rainbowkit/wallets';
import merge from 'lodash.merge';
import { useTheme } from 'next-themes';
import * as React from 'react';
import { Chain, WagmiConfig, configureChains, createConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
// @ts-ignore
const vitruveo: Chain = {
	name: 'vitruveo',
	nativeCurrency: {
		name: 'VTRU',
		decimals: 2,
		symbol: 'VTRU',
	},
	rpcUrls: {
		public: { http: ['https://test-rpc.vitruveo.xyz/'] },
		default: { http: ['https://test-rpc.vitruveo.xyz/'] },
	},
	id: 14333,
	testnet: true,
};
const { chains, publicClient, webSocketPublicClient } = configureChains(
	[vitruveo],
	[publicProvider()]
);

const projectId = 'YOUR_PROJECT_ID';

const { wallets } = getDefaultWallets({
	appName: 'RainbowKit demo',
	projectId,
	chains,
});

const demoAppInfo = {
	appName: 'Rainbowkit Demo',
};

const connectors = connectorsForWallets([
	...wallets,
	{
		groupName: 'Other',
		wallets: [
			argentWallet({ projectId, chains }),
			trustWallet({ projectId, chains }),
			ledgerWallet({ projectId, chains }),
		],
	},
]);

const wagmiConfig = createConfig({
	autoConnect: true,
	connectors,
	publicClient,
	webSocketPublicClient,
});
export function RainbowProvider({ children }: { children: React.ReactNode }) {
	const { theme: nextTheme } = useTheme();

	const theme = React.useMemo(
		() =>
			merge(nextTheme === 'light' ? lightTheme() : darkTheme(), {
				colors: {
					modalBackground: 'hsl(var(--background))',
				},
				fonts: {
					body: 'var(--font-heading)',
				},
			} as Theme),
		[nextTheme]
	);

	return (
		<WagmiConfig config={wagmiConfig}>
			<RainbowKitProvider
				coolMode
				chains={chains}
				appInfo={demoAppInfo}
				theme={theme}
			>
				{children}
			</RainbowKitProvider>
		</WagmiConfig>
	);
}
