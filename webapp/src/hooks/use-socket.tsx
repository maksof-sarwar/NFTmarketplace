'use client';
import React, { createContext, useContext, useEffect, useMemo } from 'react';

import { connectSocketServer, SocketClient } from '@marketplace/socket/client';
import { toast } from '@/lib/toast';
import { Progress, ToastId, useToast } from '@chakra-ui/react';
import { formatNumber, roundNumber, shortenAddress } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { useWindowSize } from '@uidotdev/usehooks';
import { usePathname } from 'next/navigation';
type SocketContextType = {
	socket: SocketClient | undefined;
};
const SocketConext = createContext<SocketContextType | undefined>(undefined);

const SocketProvider = ({
	children,
	slugFilter,
}: {
	children: React.ReactNode;
	slugFilter?: string;
}) => {
	const pathname = usePathname();
	const isAdminRoute = pathname.includes('admin');
	const toast = useToast();
	const toastIdRef = React.useRef<ToastId>();
	const socket = useMemo(
		() => connectSocketServer(`https://server.honcho.exchange/`),
		[]
	);

	function addToast(
		name: string,
		status: 'done' | 'progress' | 'error',
		value: number = 0,
		error?: string
	) {
		if (toastIdRef.current) {
			switch (status) {
				case 'progress':
					toast.update(toastIdRef.current, {
						render: () => {
							return <ShowProgress name={name} value={value} />;
						},
					});
					break;
				case 'done':
					toast.update(toastIdRef.current, {
						render: () => {
							return (
								<Card className="w-auto md:w-[550px] md:p-6 p-3">
									<span>collection : {name} ✅</span>;
								</Card>
							);
						},
						duration: 3000,
						isClosable: true,
					});
					toastIdRef.current = undefined;
					break;
				case 'error':
					toast.update(toastIdRef.current, {
						render: () => {
							return (
								<Card className="w-auto md:w-[550px] md:p-6 p-3">
									<span>
										collection : {name} &#10060; error : {error}
									</span>
								</Card>
							);
						},
						duration: 3000,
						isClosable: true,
					});
					toastIdRef.current = undefined;
					break;
			}
			return;
		}
		toastIdRef.current = toast({
			position: 'top-right',
			isClosable: false,
			duration: null,
			render: () => {
				return <ShowProgress name={name} value={value} />;
			},
		});
	}
	useEffect(() => {
		console.log('connect socket');
		socket.on('token_fetching_progress', ({ name, progress, address }) => {
			if (isAdminRoute || (slugFilter && slugFilter?.includes(name))) {
				addToast(name, 'progress', progress);
			}
		});
		socket.on('token_fetching_done', ({ name, address }) => {
			if (isAdminRoute || (slugFilter && slugFilter?.includes(name))) {
				addToast(name, 'done');
			}
		});
		socket.on('token_fetching_error', ({ name, address, error }) => {
			if (isAdminRoute || (slugFilter && slugFilter?.includes(name))) {
				addToast(name, 'error', 0, error);
			}
		});
		return () => {
			console.log(`disconnect socket`);
			socket.off('token_fetching_progress', () => {});
			socket.off('token_fetching_done', () => {});
			socket.off('token_fetching_error', () => {});
		};
	}, [socket, slugFilter]);
	const value = {
		socket,
	};
	return (
		<SocketConext.Provider value={value}>{children}</SocketConext.Provider>
	);
};
export const useSocket = () => {
	const context = useContext(SocketConext);
	if (context === undefined) {
		throw new Error(`useSocket must be used within a SocketProvider.`);
	}
	return context;
};
export default SocketProvider;

function ShowProgress({ value, name }: { value: number; name: string }) {
	return (
		<Card className="w-auto md:w-[550px] md:p-6 p-3">
			collections : {shortenAddress(name)} {roundNumber(value)} %
			<Progress colorScheme="purple" isAnimated hasStripe value={value} />
		</Card>
	);
}
