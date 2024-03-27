/**
 * v0 by Vercel.
 * @see https://v0.dev/t/sOeYWVYt8Dd
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
'use client';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { AutoComplete } from '../auto-complete';
import { Icons } from '../icons';
import { Logo } from '../logo';
import { MobileSearch } from '../mobile-search';
import { Button, buttonVariants } from '../ui/button';
import { ConnectButton } from './connect-button';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
	const pathname = usePathname();
	const { isConnected } = useAccount();
	console.log(pathname);
	// 2xl:bg-red-400 xl:bg-orange-400 lg:bg-blue-400 md:bg-green-400 sm:bg-yellow-400 bg-slate-400
	return (
		<header className="w-full h-24 bg-opacity-75 backdrop-filter backdrop-blur-lg z-50 gap-4 flex items-center justify-center px-8 relative">
			<Logo />
			<MobileSearch />
			<AutoComplete className="hidden md:flex" />
			<div className="lg:flex hidden gap-3 justify-center items-center">
				<Link
					href="/activity"
					className={cn(
						buttonVariants({
							variant: pathname.includes(`activity`) ? 'default' : 'outline',
							size: 'icon',
						})
						// 'h-10 w-auto'
					)}
				>
					<Icons.activity active={!!pathname.includes(`activity`)} />
				</Link>
				<Link
					href="/leaderboard"
					className={cn(
						buttonVariants({
							variant: pathname.includes(`leaderboard`) ? 'default' : 'outline',
							size: 'icon',
						})
					)}
				>
					<Icons.airdrop active={!!pathname.includes(`leaderboard`)} />
				</Link>
				<Button variant="outline" className="uppercase flex gap-2">
					<Icons.vtru className="w-6 text-primary " />
					<span className="font-heading">24HR REBASE GOAL</span>{' '}
					<span className="font-thin">15,000 TXT </span>
					<span className="font-heading">Time Remaining</span>
					<span className="font-thin">24:00:45</span>
				</Button>
			</div>
			<div className="ml-auto gap-2 flex items-center">
				<div className="lg:flex items-center gap-2 hidden">
					<Image
						src="/svg/Blockchain-header-icons.svg"
						width={50}
						height={50}
						className="w-32"
						alt=""
					/>
					<ConnectButton />
				</div>
			</div>
		</header>
	);
}
