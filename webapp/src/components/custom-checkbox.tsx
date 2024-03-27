import { cn } from '@/lib/utils';
import { Checkbox } from '@chakra-ui/react';
import { ComponentProps } from 'react';

type CustomCheckboxProps = ComponentProps<typeof Checkbox> & {};

export function CustomCheckbox({
	className,
	children,
	...props
}: CustomCheckboxProps) {
	return (
		<Checkbox
			colorScheme="gray"
			className={cn('heading', className)}
			{...props}
		>
			{children}
		</Checkbox>
	);
}
