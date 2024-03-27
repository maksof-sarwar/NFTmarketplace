'use client';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import Image from 'next/image';
export type TViewMode = 'LIST' | 'GRID';

interface ViewModeProps {
	onViewModeChange?: (viewMode: TViewMode) => void;
	defaultViewMode?: TViewMode;
}

export const ViewMode = ({
	onViewModeChange,
	defaultViewMode,
}: ViewModeProps) => {
	const [view, setView] = useState<TViewMode>(defaultViewMode ?? 'GRID');
	useEffect(() => {
		if (onViewModeChange) {
			onViewModeChange(view);
		}
	}, [view]);
	return (
		<div className="flex gap-2">
			<Button
				size="icon"
				variant={view !== 'GRID' ? 'outline' : 'default'}
				onClick={() => setView('GRID')}
			>
				<svg
					version="1.1"
					baseProfile="tiny"
					id="Layer_1"
					xmlns="http://www.w3.org/2000/svg"
					xmlnsXlink="http://www.w3.org/1999/xlink"
					x="0px"
					y="0px"
					viewBox="0 0 23.4 22.1"
					overflow="visible"
					xmlSpace="preserve"
					className={cn('w-5', view === 'GRID' ? 'text-white' : 'text-primary')}
				>
					<g>
						<rect
							x="0.3"
							y="0.4"
							fill="currentColor"
							width="5.7"
							height="5.7"
						/>
						<rect
							x="8.7"
							y="0.4"
							fill="currentColor"
							width="5.7"
							height="5.7"
						/>
						<rect
							x="17.1"
							y="0.4"
							fill="currentColor"
							width="5.7"
							height="5.7"
						/>
						<rect
							x="0.3"
							y="8.2"
							fill="currentColor"
							width="5.7"
							height="5.7"
						/>
						<rect
							x="8.7"
							y="8.2"
							fill="currentColor"
							width="5.7"
							height="5.7"
						/>
						<rect
							x="17.1"
							y="8.2"
							fill="currentColor"
							width="5.7"
							height="5.7"
						/>
						<rect x="0.3" y="16" fill="currentColor" width="5.7" height="5.7" />
						<rect x="8.7" y="16" fill="currentColor" width="5.7" height="5.7" />
						<rect
							x="17.1"
							y="16"
							fill="currentColor"
							width="5.7"
							height="5.7"
						/>
					</g>
				</svg>
			</Button>
			<Button
				size="icon"
				variant={view !== 'LIST' ? 'outline' : 'default'}
				onClick={() => setView('LIST')}
			>
				<svg
					version="1.1"
					id="Layer_1"
					xmlns="http://www.w3.org/2000/svg"
					xmlnsXlink="http://www.w3.org/1999/xlink"
					x="0px"
					y="0px"
					viewBox="0 0 27.5 21.7"
					xmlSpace="preserve"
					className={cn('w-5', view === 'LIST' ? 'text-white' : 'text-primary')}
				>
					<style type="text/css">
						{`
		.st0{fill:currentColor;}
	`}
					</style>
					<g>
						<rect x="0.2" y="0.2" className="st0" width="5.7" height="5.7" />
						<rect x="0.2" y="8" className="st0" width="5.7" height="5.7" />
						<rect x="0.2" y="15.8" className="st0" width="5.7" height="5.7" />
						<rect x="10.2" y="1.9" className="st0" width="17" height="2" />
						<rect x="10.2" y="9.4" className="st0" width="17" height="2" />
						<rect x="10.2" y="17.4" className="st0" width="17" height="2" />
					</g>
				</svg>
			</Button>
		</div>
		// <Tabs defaultValue={view}>
		// 	<TabsList className="w-full grid-cols-2 max-w-[100px] md:grid hidden border bg-accent dark:bg-card">
		// 		<TabsTrigger value="GRID" onClick={() => setView('GRID')}>
		// 			<span
		// 				className={cn(
		// 					view === 'GRID' ? 'text-primary' : '',
		// 					'icon-[oi--grid-three-up]'
		// 				)}
		// 			></span>
		// 		</TabsTrigger>
		// 		<TabsTrigger value="LIST" onClick={() => setView('LIST')}>
		// 			<span
		// 				className={cn(
		// 					view === 'LIST' ? 'text-primary' : '',
		// 					'icon-[formkit--list]'
		// 				)}
		// 			></span>
		// 		</TabsTrigger>
		// 	</TabsList>
		// </Tabs>
	);
};
