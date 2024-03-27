'use client';
import { useColorMode } from '@chakra-ui/react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { ComponentProps, useCallback } from 'react';
import { Button } from './ui/button';

interface ThemeSwitcherProps extends ComponentProps<'div'> {}
export const ThemeSwitcher = ({ className }: ThemeSwitcherProps) => {
	const { setTheme, theme } = useTheme();
	const { toggleColorMode } = useColorMode();
	const setDarkMode = useCallback(() => {
		toggleColorMode();
		setTheme(theme === 'light' ? 'dark' : 'light');
	}, [theme]);
	return (
		<Button variant="outline" size="icon" onClick={setDarkMode}>
			<Image
				alt="light"
				src="/svg/theme-switcher.svg"
				className="text-primary w-5  cursor-pointer"
				width={40}
				height={40}
			/>
		</Button>
	);
};
