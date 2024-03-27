export {
	Tabs as ChakraTabs,
	TabList,
	TabPanel,
	TabPanels,
} from '@chakra-ui/react';

import { Tab } from '@chakra-ui/react';
import { ComponentProps } from 'react';

export const ChakraTab = ({
	children,
	...props
}: ComponentProps<typeof Tab>) => {
	return (
		<Tab
			_selected={{
				bg: 'primary.DEFAULT',
				color: 'white',
				fontFamily: 'var(--font-heading)',
			}}
			className="uppercase"
			color="hsl(var(--primary))"
			height="44px"
			paddingX="25px"
			fontSize="14px"
			border="1px"
			borderColor="hsl(var(--primary))"
			borderRadius="calc(var(--radius) - 2px)"
			fontFamily="var(--font-sans)"
			{...props}
		>
			{children}
		</Tab>
	);
};
