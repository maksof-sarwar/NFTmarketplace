import { cn } from '@/lib/utils';
import { Center } from '@chakra-ui/react';
import React, { Component, ComponentProps } from 'react';

interface NoRecordFoundProps extends ComponentProps<'div'> {
	title?: string;
}
export const NoRecordFound = ({
	title,
	className,
	...prps
}: NoRecordFoundProps) => {
	return (
		<Center h="100%">
			<h3 className="inline-flex gap-2 mx-auto heading text-primary text-3xl ">
				{title ?? 'No Record Found'}
			</h3>
		</Center>
	);
};
