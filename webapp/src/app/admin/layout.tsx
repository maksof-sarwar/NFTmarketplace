import SocketProvider from '@/hooks/use-socket';
import React from 'react';

export default ({ children }: { children: React.ReactNode }) => {
	return (
		<SocketProvider>
			<main className="container mt-10 p-10">{children}</main>
		</SocketProvider>
	);
};
