import {
	TableContainer,
	Thead,
	Tr,
	Th,
	Tbody,
	Td,
	Table as ChakraTable,
} from '@chakra-ui/react';
import React from 'react';

export const Table = () => {
	return (
		<TableContainer>
			<ChakraTable variant="striped" color="#000000" colorScheme="teal">
				<Thead>
					<Tr>
						<Th>To convert</Th>
						<Th>into</Th>
						<Th isNumeric>multiply by</Th>
					</Tr>
				</Thead>
				<Tbody rounded="xl">
					<Tr>
						<Td roundedLeft="xl">inches</Td>
						<Td>millimetres (mm)</Td>
						<Td isNumeric roundedRight="xl">
							25.4
						</Td>
					</Tr>
					<Tr>
						<Td>feet</Td>
						<Td>centimetres (cm)</Td>
						<Td isNumeric>30.48</Td>
					</Tr>
					<Tr>
						<Td>yards</Td>
						<Td>metres (m)</Td>
						<Td isNumeric>0.91444</Td>
					</Tr>
				</Tbody>
			</ChakraTable>
		</TableContainer>
	);
};
