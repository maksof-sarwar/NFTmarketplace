import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Button } from './ui/button';

interface DaySwitcherProps<T extends Readonly<Array<string>>> {
	switches: T;
	defaultValue?: T[number];
	onChange?: (value: T) => void;
}

export const DaySwitcher = <T extends Readonly<Array<string>>>({
	switches,
	defaultValue,
	onChange,
}: DaySwitcherProps<T>) => {
	const [selected, setSelected] = useState<T[number] | undefined>(defaultValue);
	return (
		<div className="flex gap-2">
			{switches.map((sw, key) => (
				<Button
					variant={selected === sw ? 'default' : 'outline'}
					className={cn(selected === sw ? 'font-heading' : 'font-thin')}
					key={key}
					onClick={() => {
						if (onChange) {
							onChange(sw as any);
						}
						setSelected(sw);
					}}
					value={sw}
				>
					<span>{sw}</span>
				</Button>
			))}
		</div>
	);
};
