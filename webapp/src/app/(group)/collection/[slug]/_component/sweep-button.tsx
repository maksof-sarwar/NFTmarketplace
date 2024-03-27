import { useContract } from '@/hooks/use-contract';
import { useSweep } from '@/hooks/use-sweep';
import { CollectionTokens } from '@/types';
import {
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
} from '@chakra-ui/react';
import Image from 'next/image';
import { Fragment } from 'react';

interface SweepButtonProps {
	tokens: CollectionTokens[];
}

export const SweepButton = ({ tokens }: SweepButtonProps) => {
	const { account } = useContract();
	const activeTokens = tokens.filter((token) => token.type === 'LISTING');
	const { sweepItems, setSweep } = useSweep();
	return (
		<Fragment>
			<div className="flex md:gap-5 border-2 border-primary rounded items-center uppercase text-xs">
				<span className="ml-3 inline-flex items-center gap-1">
					<svg
						version="1.1"
						baseProfile="tiny"
						id="Layer_1"
						xmlns="http://www.w3.org/2000/svg"
						xmlnsXlink="http://www.w3.org/1999/xlink"
						x="0px"
						y="0px"
						viewBox="0 0 24 24"
						overflow="visible"
						xmlSpace="preserve"
						className="w-4 text-primary"
					>
						<g>
							<path
								fill="currentColor"
								d="M4.1,10.5c0.1,0,0.2,0.1,0.2,0.2l0.3,0.7c0,0.1,0.1,0.1,0.1,0L5,10.7c0-0.1,0.1-0.2,0.2-0.2l0.7-0.3
		c0.1,0,0.1-0.1,0-0.1L5.2,9.8C5.1,9.8,5,9.7,5,9.6L4.7,8.9c0-0.1-0.1-0.1-0.1,0L4.3,9.6c0,0.1-0.1,0.2-0.2,0.2l-0.7,0.3
		c-0.1,0-0.1,0.1,0,0.1L4.1,10.5z"
							/>
							<path
								fill="currentColor"
								d="M16.6,19c-0.1,0-0.2-0.1-0.2-0.2l-0.2-0.5c0-0.1-0.1-0.1-0.1,0l-0.2,0.5c0,0.1-0.1,0.2-0.2,0.2l-0.5,0.2
		c-0.1,0-0.1,0.1,0,0.1l0.5,0.2c0.1,0,0.2,0.1,0.2,0.2l0.2,0.5c0,0.1,0.1,0.1,0.1,0l0.2-0.5c0-0.1,0.1-0.2,0.2-0.2l0.5-0.2
		c0.1,0,0.1-0.1,0-0.1L16.6,19z"
							/>
							<path
								fill="currentColor"
								d="M7.3,8.7c0.1,0,0.2,0.1,0.2,0.2l0.2,0.5c0,0.1,0.1,0.1,0.1,0L8,8.8c0-0.1,0.1-0.2,0.2-0.2l0.5-0.2
		c0.1,0,0.1-0.1,0-0.1L8.2,8.1c0,0-0.1-0.1-0.2-0.2L7.8,7.4c0-0.1-0.1-0.1-0.1,0L7.5,7.9c0,0.1-0.1,0.2-0.2,0.2L6.8,8.3
		c-0.1,0-0.1,0.1,0,0.1L7.3,8.7z"
							/>
							<path
								fill="currentColor"
								d="M15.1,12.1l-3.6-2.6c-4.7,4.4-8.6,4-9.6,4.2c-0.1,0-0.2,0.1-0.2,0.2c0,0.8,0.8,2.9,1.4,2.9
		c0.7,0,2.5-1.2,2.5-1.2s-1.2,1-1.2,1.8c0,1.1,1.4,1.7,1.4,1.7c0.2-0.8,1-1.8,1-1.8S6.3,19.4,6.7,20c0.6,0.9,2.3,1.5,3,1.7
		c0.2,0.1,0.3-0.1,0.3-0.2c-0.3-1.9,1.2-3.2,1.2-3.2s-1.1,3,0.3,4c1.2,0.9,2.4,0.4,2.8,0.3c0.1,0,0.1-0.1,0.1-0.2
		C14.1,21.3,12,17.7,15.1,12.1z"
							/>
							<path
								fill="currentColor"
								d="M20.7,0.6c-0.4-0.3-0.9-0.2-1.2,0.2l-4.1,6.1c-0.9-0.3-2,0-2.6,0.8L12,8.9l3.7,2.6l0.9-1.2
		c0.6-0.8,0.6-1.9,0-2.7l4.5-5.8l0,0C21.2,1.4,21.1,0.8,20.7,0.6z"
							/>
						</g>
					</svg>

					<span>sweep</span>
				</span>
				<NumberInput
					max={activeTokens?.length ?? 25}
					value={sweepItems.length}
					className="dark:border-dark max-w-[100px]"
					onChange={(e) => {
						let len = tokens.length;
						const _value = Number(e);
						if (_value <= tokens?.length) {
							len = _value;
						}
						setSweep(
							activeTokens
								.filter((a) => a.seller !== account)
								.slice(0, _value)
								.map((token) => ({
									listingId: token.listingId,
									price: token.price,
									tokenId: token.token_id,
								}))
						);
					}}
				>
					<NumberInputField className="px-1 w-14 border-none !shadow-none font-heading" />
					<NumberInputStepper>
						<NumberIncrementStepper className="border-primary text-primary" />
						<NumberDecrementStepper className=" border-primary  text-primary" />
					</NumberInputStepper>
				</NumberInput>
			</div>
		</Fragment>
	);
};
