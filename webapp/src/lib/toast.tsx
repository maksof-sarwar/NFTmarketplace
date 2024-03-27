'use client';
import { createStandaloneToast } from '@chakra-ui/react';

const { ToastContainer, toast } = createStandaloneToast({
	defaultOptions: {
		isClosable: true,
		duration: 2000,
		status: 'success',
	},
});

export { ToastContainer, toast };
