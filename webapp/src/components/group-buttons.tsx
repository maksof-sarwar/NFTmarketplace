import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Button } from './ui/button';

type Data = Readonly<Array<string> | Array<{ value: string; label: string }>>;
interface GroupButtonsProps<T extends Data> {
	switches: T;
	defaultValue?: T[number];
	onChange?: (value: T[number]) => void;
}

export const GroupButtons = <T extends Data>({
	switches,
	defaultValue,
	onChange,
}: GroupButtonsProps<T>) => {
	const [selected, setSelected] = useState<T[number] | undefined>(defaultValue);
	return (
		<div className="flex gap-2">
			{switches.map((sw, key) => {
				if (typeof sw === 'string') {
					return (
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
					);
				}

				return (
					<Button
						variant={selected === sw ? 'default' : 'outline'}
						className={cn(selected === sw ? 'font-heading' : 'font-thin')}
						key={key}
						onClick={() => {
							if (onChange) {
								onChange(sw);
							}
							setSelected(sw);
						}}
						value={sw.value}
					>
						<span>{sw.label}</span>
					</Button>
				);
			})}
		</div>
	);
};
