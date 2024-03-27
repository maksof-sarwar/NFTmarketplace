'use client';
import { useClipboard } from '@chakra-ui/react';
import { ComponentProps } from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
interface CopyToClipboard extends ComponentProps<typeof Button> {
	text: string;
	iconClassName?: string;
}

export const CopyToClipboard = ({
	text,
	className,
	iconClassName,
	...props
}: CopyToClipboard) => {
	const { onCopy, hasCopied } = useClipboard(text);
	return (
		<Button
			className={className}
			variant="link"
			size={'icon'}
			onClick={onCopy}
			children={
				!hasCopied ? (
					<span className={cn('icon-[tdesign--copy]', iconClassName)}></span>
				) : (
					<span
						className={cn(
							iconClassName,
							'icon-[lets-icons--check-fill] text-status-success'
						)}
					/>
				)
			}
			{...props}
		/>
	);
};
