'use client';

import type { KeyboardEvent } from 'react';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Command as CommandPrimitive } from 'cmdk';
import { Check } from 'lucide-react';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from './ui/command';
import { Skeleton } from './ui/skeleton';
import { useDebounce } from '@uidotdev/usehooks';
import { api } from '@/trpc/react';
import Link from 'next/link';
import { CollectionMetadata } from '@/types';
import Image from 'next/image';
import { Spinner } from './pending';
import { usePathname } from 'next/navigation';

export const AutoComplete = ({ className }: { className?: string }) => {
	const pathname = usePathname();
	const [search, setSearch] = useState<string>();
	const debouncedSearch = useDebounce(search, 500);
	const { data: collections = [], isFetching } = api.collection.get.useQuery({
		name: debouncedSearch,
		take: 5,
	});
	const inputRef = useRef<HTMLInputElement>(null);
	const [isOpen, setOpen] = useState(false);
	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			const input = inputRef.current;
			if (!input) {
				return;
			}

			// Keep the options displayed when the user is typing
			if (!isOpen) {
				setOpen(true);
			}

			if (event.key === 'Escape') {
				input.blur();
			}
		},
		[isOpen, collections]
	);
	const handleBlur = useCallback(() => {
		setOpen(false);
	}, []);
	useEffect(() => {
		setOpen(false);
		setSearch('');
	}, [pathname]);
	return (
		<CommandPrimitive onKeyDown={handleKeyDown}>
			<div
				className={cn(' w-full 2xl:w-[300px] rounded-sm bg-input', className)}
			>
				<CommandInput
					ref={inputRef}
					value={search}
					placeholder="SEARCH"
					onBlur={handleBlur}
					onValueChange={(search) => setSearch(search)}
				/>
			</div>
			<div className="relative mt-1 z-50">
				<Command shouldFilter={false}>
					{isOpen ? (
						<div className="absolute top-0 z-10 w-full rounded-sm bg-input outline-none animate-in fade-in-0 zoom-in-95">
							<CommandList className="rounded-sm border">
								{isFetching ? (
									<div className="text-center inline-flex gap-2 justify-center items-center w-full p-4 text-primary">
										Loading
										<Spinner />
									</div>
								) : (
									<Fragment>
										<CommandEmpty>No results found.</CommandEmpty>
										<CommandGroup>
											{collections.length > 0 &&
												// @ts-ignore
												collections.map((option, key) => {
													const metadata =
														option.metadata as CollectionMetadata;
													return (
														<Link
															key={key}
															href={`/collection/${option.slug}`}
															className="flex gap-3 cursor-pointer font-heading justify-center items-center"
														>
															<CommandItem
																key={option.address}
																onMouseDown={(event) => {
																	event.preventDefault();
																	event.stopPropagation();
																}}
																className={cn(
																	'flex w-full items-center gap-2  cursor-pointer'
																)}
															>
																<Image
																	className="rounded-xl overflow-hidden"
																	src={option.logo}
																	width={50}
																	height={50}
																	alt="logo"
																/>
																<div className="flex flex-col gap-1 text-primary">
																	<span className="font-heading ">
																		{metadata.name}
																	</span>
																	{metadata?.description && (
																		<span className="font-sans font-thin text-xs ">
																			{metadata.description}
																		</span>
																	)}
																</div>
															</CommandItem>
														</Link>
													);
												})}
										</CommandGroup>
									</Fragment>
								)}
							</CommandList>
						</div>
					) : null}
				</Command>
			</div>
		</CommandPrimitive>
	);
};
