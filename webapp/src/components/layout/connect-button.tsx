'use client';
import { ConnectButton as _ConnectButton } from '@rainbow-me/rainbowkit';
import { Button, buttonVariants } from '../ui/button';
import Link from 'next/link';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
} from '../ui/dropdown-menu';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn, formatNumber, shortenAddress } from '@/lib/utils';
import { CopyToClipboard } from '../copy-to-clipboard';

export const ConnectButton = () => {
	return (
		<_ConnectButton.Custom>
			{({
				account,
				chain,
				openAccountModal,
				openChainModal,
				openConnectModal,
				authenticationStatus,
				mounted,
			}) => {
				const ready = mounted && authenticationStatus !== 'loading';
				const connected =
					ready &&
					account &&
					chain &&
					(!authenticationStatus || authenticationStatus === 'authenticated');
				return (
					<div
						{...(!ready && {
							'aria-hidden': true,
							style: {
								opacity: 0,
								pointerEvents: 'none',
								userSelect: 'none',
							},
						})}
					>
						{(() => {
							if (!connected) {
								return (
									<Button
										onClick={openConnectModal}
										variant="default"
										className="text-xs uppercase gap-3 h-10 items-center dark:text-white"
									>
										<span className="icon-[iconoir--wallet] text-2xl dark:text-white"></span>
										Connect
									</Button>
								);
							}
							if (chain.unsupported) {
								return (
									<Button
										className="text-xs gap-1 items-center dark:text-white "
										variant="destructive"
										onClick={openChainModal}
										type="button"
									>
										Wrong network
									</Button>
								);
							}
							return (
								<div className="flex justify-center items-center gap-4 dark:text-white">
									<div className="font-sans font-thin inline-flex gap-1 dark:text-white text-primary">
										{formatNumber(account.balanceFormatted ?? '0')}{' '}
										<span className="font-heading">
											{account.balanceSymbol}
										</span>
									</div>
									<Popover>
										<PopoverTrigger asChild>
											<Button
												className="text-xs gap-1 items-center dark:text-white"
												// onClick={openAccountModal}
												size="icon"
											>
												<span className="icon-[carbon--user-avatar-filled] text-2xl"></span>
											</Button>
										</PopoverTrigger>
										<PopoverContent align="end" className="w-48 p-4 space-y-2 ">
											<div className="inline-flex gap-2 font-heading  text-sm justify-center items-center">
												<span className="icon-[carbon--user-avatar-filled] text-2xl"></span>{' '}
												{shortenAddress(account.address)}
												<CopyToClipboard
													className="w-4"
													iconClassName="text-xs text-white"
													text={account.address}
												/>
											</div>
											<Link
												href={`/profile/${account.address}`}
												className={cn(
													buttonVariants({
														className:
															'bg-white hover:bg-white/70 font-heading w-full ',
													}),
													'text-primary'
												)}
											>
												My Profile
											</Link>
											<Button
												onClick={openAccountModal}
												className="bg-white hover:bg-white/70 font-heading w-full text-primary"
											>
												Disconnect
											</Button>
										</PopoverContent>
									</Popover>
								</div>
							);
						})()}
					</div>
				);
			}}
		</_ConnectButton.Custom>
	);
};
