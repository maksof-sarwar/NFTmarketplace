'use client';

import {
	ChakraProvider as Providers,
	ThemeConfig,
	extendTheme,
} from '@chakra-ui/react';
import { useTheme } from 'next-themes';
import { useMemo } from 'react';

export function ChakraProvider({ children }: { children: React.ReactNode }) {
	const { theme } = useTheme();
	const themeConfig = useMemo(
		() =>
			extendTheme({
				config: {
					initialColorMode: theme,
					useSystemColorMode: false,
				} as ThemeConfig,
				colors: {
					primary: {
						DEFAULT: 'hsl(var(--primary))',
						50: '#F5EBFF',
						100: '#EBD6FF',
						200: '#D6ADFF',
						300: '#C285FF',
						400: '#AD5CFF',
						500: '#9933FF',
						600: '#7D00FA',
						700: '#6100C2',
						800: '#45008A',
						900: '#290052',
						950: '#1B0036',
					},
				},
			}),
		[theme]
	);
	return <Providers theme={themeConfig}>{children}</Providers>;
}
