'use client';
import { useContract } from '@/hooks/use-contract';
import React, { useEffect } from 'react';

export default () => {
	const { contract } = useContract();
	useEffect(() => {
		contract?.methods
			.collectionInfos('0x4b8619c321EfB7792972Be4Fc0BA1D6d5cC9Ab60')
			.call()
			.then(console.log);
		console.log(contract?.methods);
	}, [contract]);
	return <div>page</div>;
};
