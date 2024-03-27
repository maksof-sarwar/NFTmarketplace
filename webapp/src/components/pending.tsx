'use client';
import { cn } from '@/lib/utils';
import React, { Component, ComponentProps } from 'react';
import { RefreshButton } from './ui/button';

interface PendingProps {
	title?: string;
}

export const Pending = ({ title }: PendingProps) => {
	return (
		<div className="fixed top-0 h-screen w-screen  backdrop-blur-sm flex flex-col justify-center items-center z-50">
			<h3 className="inline-flex gap-2 mx-auto heading text-primary text-3xl ">
				{title ?? 'Loading'} <RefreshButton className="w-6" isLoading />
			</h3>
		</div>
	);
};

interface SpinnerProps extends ComponentProps<'span'> {}

export const Spinner = ({ className, ...props }: SpinnerProps) => {
	return (
		<span
			className={cn(
				'text-2xl text-primary',
				className,
				'icon-[svg-spinners--tadpole] '
			)}
			{...props}
		></span>
	);
};
