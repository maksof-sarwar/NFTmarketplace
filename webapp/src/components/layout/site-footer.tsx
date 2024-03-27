'use client';
import Image from 'next/image';
import React, { ComponentProps } from 'react';
import { Icons } from '../icons';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

const urls = [
	{
		href: '',
		icon: () => (
			<Image
				src="/svg/explorer-footer-Logo.svg"
				alt="explorer"
				className="w-9"
				width={50}
				height={50}
			/>
		),
		label: 'explorer',
	},
	{
		href: '',
		icon: () => (
			<Image
				src="/svg/VTRO-Swap-Footer-Logo.svg"
				alt="vitru"
				className="w-9"
				width={50}
				height={50}
			/>
		),
		label: 'vitru',
	},
	{
		href: '',
		icon: () => (
			<Image
				src="/svg/X-footer-icon.svg"
				alt="x"
				className="w-9"
				width={50}
				height={50}
			/>
		),
		label: 'X',
	},
	{
		href: '',
		icon: () => (
			<Image
				src="/svg/Discord-footer-icon.svg"
				alt="discord"
				className="w-9"
				width={50}
				height={50}
			/>
		),
		label: 'Discord',
	},
];

export const SiteFooter = () => {
	return (
		<footer className="bg-input  w-full   text-primary">
			<div className="container font-heading lg:mx-18 max-w-full   flex flex-col md:flex-row items-center justify-between ">
				<div className=" flex items-center space-x-8 justify-center md:order-3  ">
					<Button variant="outline" className="bg-inherit font-sans font-thin">
						PROJECT LAUNCHPAD
					</Button>
					<span className="inline-flex space-x-4 items-center">
						{urls.map((url, key) => (
							<a key={key} href={url.href} target="_blank">
								<span className="sr-only">{url.label}</span>
								<url.icon />
							</a>
						))}
					</span>
				</div>
				<div className="mt-4 md:order-1 md:mt-0 text-xs lg:text-base  flex gap-4 justify-center items-center ">
					<Eplay className="size-24 text-primary" />
				</div>
			</div>
		</footer>
	);
};

function Eplay({ ...props }: ComponentProps<'svg'>) {
	return (
		<svg
			version="1.1"
			baseProfile="tiny"
			id="Layer_1"
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			x="0px"
			y="0px"
			viewBox="0 0 102 37"
			overflow="visible"
			xmlSpace="preserve"
			{...props}
		>
			<g>
				<g>
					<g>
						<g>
							<path
								fill="currentColor"
								d="M36,10c-1-1.1-2.4-1.7-4.1-1.7c-2.1,0-3.9,0.9-5.3,1.8V8.6h-5.2l-0.3,1.8l5.7,3.6l5.7,3.6
					c1.1,0.7,0.9,2.4-0.4,3.1l-6.8,3.6l-6.8,3.6c0,0,0,0-0.1,0l-1.1,7.5h5.8l1.2-8.2c0.9,0.2,2.2,0.5,3.3,0.5c4.6,0,8-3.1,8.7-8
					l0.6-4.2C37.6,13.2,37.2,11.3,36,10z"
							/>
						</g>
						<path
							fill="currentColor"
							d="M47.3,0.5h-5.9l-2.9,19.2c-0.2,1.4-0.3,2.5-0.4,3.5c-0.1,1.5,0.2,2.6,0.9,3.3c0.8,0.8,2,1.2,3.7,1.2
				s2.9-0.4,3.4-0.6l0.2-0.1l0.6-4.6l-0.5,0.1c-0.3,0.1-0.8,0.2-1.4,0.2c-0.3,0-0.6-0.1-0.7-0.2c-0.1-0.2-0.2-0.5-0.1-0.9L47.3,0.5z
				"
						/>
						<path
							fill="currentColor"
							d="M64.2,27.3l2.7-17.8l-0.2-0.1c-2-0.8-4.8-1.2-7.7-1.2c-5.4,0-9,2.9-9.7,8l-0.6,4.1
				c-0.4,2.3,0.1,4.3,1.2,5.6c1,1.1,2.4,1.7,4.1,1.7c2.1,0,3.9-0.9,5.3-1.8v1.5L64.2,27.3L64.2,27.3z M57.9,20.2l-3.3,1.7
				c-0.6,0.3-1.2-0.1-1.2-0.7l0.5-3.5l0.5-3.5c0.1-0.6,0.9-1.1,1.4-0.7l2.8,1.7l2.8,1.7c0.5,0.3,0.4,1.1-0.2,1.5L57.9,20.2z"
						/>
						<path
							fill="currentColor"
							d="M87.2,8.6h-6.3l-0.1,0.2c-1.1,4.7-2.8,9.7-4.6,14L74.6,8.6h-6.2L71,28h2.2c-1.2,1.4-3.3,2.8-5.3,2.8
				c-1.6,0-3-0.4-3.5-0.6L64,30.1l-1.3,4.8L63,35c0.4,0.2,2,0.8,4.7,0.8C75.9,35.8,82.3,27,87,9L87.2,8.6z"
						/>
						<path
							fill="currentColor"
							d="M95.8,16c-2.1-0.6-2.8-0.9-2.8-1.6c0-0.9,0.3-1.6,2.5-1.6c1.4,0,3.1,0.3,4.1,0.6l0.3,0.1l1.2-4.4L100.8,9
				c-1.7-0.4-3.6-0.7-5.5-0.7c-2.4,0-4.5,0.7-5.9,1.9s-2.2,3-2.2,5.1c0,2.9,1.5,3.9,3.8,4.6c2.5,0.7,3.2,1,3.2,1.8
				c0,0.9-0.4,1.5-2.6,1.5c-1.7,0-3.6-0.5-4.4-0.8l-0.3-0.1l-1.4,4.4l0.3,0.1c1.1,0.5,3.5,1,6.1,1s4.6-0.6,6-1.7
				c1.4-1.2,2.2-3,2.2-5.3C100,18.1,98.8,16.8,95.8,16z"
						/>
					</g>
				</g>
				<path
					fill="currentColor"
					d="M6.9,19.7C7.7,19.9,8.8,20,9.8,20c4.1,0,8.7-0.7,8.7-6.4c0-3.5-2.7-5.6-7-5.6c-5.3,0-9,3.1-9.7,8.2
		l-0.6,3.7c-0.4,2.4,0.1,4.3,1.3,5.8C3.8,27.2,6,28,8.8,28c2.4,0,4.8-0.3,7-0.9h0.1l0.2-4.3v-0.2h-0.2c-1,0.2-3,0.6-5.5,0.6
		c-1.5,0-2.5-0.3-3-1C7,21.7,6.8,21,6.9,20.1L6.9,19.7z M10.7,12.4c1.4,0,2.1,0.6,2.1,1.8c0,1.7-1,2.4-3.4,2.4c-0.6,0-1.4-0.1-2-0.2
		l0.1-0.7C7.8,13.5,8.9,12.4,10.7,12.4z"
				/>
			</g>
		</svg>
	);
}
