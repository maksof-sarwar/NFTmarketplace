'use client';
import CONTRACT from '@/../contract';
import { toast } from '@/lib/toast';
import { convertBigNumber } from '@/lib/utils';
import { NftToken, NftTokenMetadata } from '@/types';
import { ethers } from 'ethers';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import Web3, { Contract, PayableCallOptions } from 'web3';
import { create } from 'zustand';
import { combine } from 'zustand/middleware';

const { MARKET_PLACE, NFT_CONTRACT } = CONTRACT;
export const gasPrice = ethers.utils.parseUnits('25', 'gwei').toString();
declare global {
	interface Window {
		ethereum?: any;
	}
}
interface ContractState {
	web3?: Web3;
	contract?: Contract<(typeof MARKET_PLACE)['abi']>;
	account?: string;
	error?: string;
	ready: boolean;
	smartContract: typeof CONTRACT;
}

export const useContract = create(
	combine(
		{ ready: false, smartContract: CONTRACT } as ContractState,
		(set, get) => ({
			initialize: async () => {
				try {
					if (!window) return;
					const ethereum = window.ethereum;
					if (!ethereum) {
						throw new Error('Ethereum wallet not found.');
					}
					await ethereum.enable();
					const web3 = new Web3(window.ethereum);

					const accounts = await web3.eth.getAccounts();
					const contract = new web3.eth.Contract<typeof MARKET_PLACE.abi>(
						MARKET_PLACE.abi,
						MARKET_PLACE.contractAddress
					);
					set({
						web3,
						contract,
						account: accounts[0],
						ready: true,
					});
				} catch (err: any) {
					toast({
						id: 'contract',
						status: 'error',
						title: 'Error loading blockchain data',
						description: err.message,
						isClosable: true,
						duration: null,
					});
					set({ error: err.message });
				}
			},

			exec: async (
				name: string,
				type: 'send' | 'call',
				option: PayableCallOptions,
				...args: any[]
			): Promise<any> => {
				const { contract, account, web3 } = get();
				try {
					if (!contract) {
						throw new Error('Contract not initialized.');
					}
					const method = contract.methods[name](...args);

					// Fetch current gas price
					const gasPrice = await web3?.eth.getGasPrice();

					// Estimate gas limit for the transaction
					const estimatedGas = await method.estimateGas({
						from: account,
						gasPrice: gasPrice?.toString(), // Convert to string if necessary
						...option,
					});

					const tx = await method[type]({
						from: account,
						gasPrice: gasPrice?.toString(), // Convert to string if necessary
						gas: estimatedGas.toString(), // Convert to string if necessary
						...option,
					});
					return tx;
				} catch (error: any) {
					toast({
						id: 'contract',
						status: 'error',
						title: 'Error during transaction.',
						description: error?.data?.message || error.message,
						duration: 10000,
					});
				}
			},
		})
	)
);

export const ContractProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const { initialize } = useContract();

	useEffect(() => {
		initialize();
	}, [initialize]);
	return <Fragment>{children}</Fragment>;
};

export const useGetBalance = (address: string) => {
	const { ready, web3 } = useContract();
	const [balance, setBalance] = useState<string>('Loading...');

	const _getBalance = useCallback(async () => {
		if (!ready || !web3) return 'Loading...' as string;
		const _bal = await web3.eth?.getBalance(address);
		return web3.utils.fromWei(_bal, 'ether');
	}, [address, ready]);
	useEffect(() => {
		_getBalance().then(setBalance);
	}, [_getBalance]);

	return {
		balance,
	};
};

export const useNftListing = ({
	address,
	sellerAddress,
}: {
	address?: string;
	sellerAddress?: string;
}) => {
	const [loading, setLoading] = useState(true);
	const [reload, setReload] = useState(true);
	const { contract, web3 } = useContract();
	const [listings, setListings] = useState<NftToken[]>([]);
	const cb = useCallback(
		async (contract: Contract<any>, web3: Web3) => {
			const _listings = (await contract.methods
				.getAllListings()
				.call()) as any[];
			let listings = _listings;
			if (address) {
				listings = _listings.filter(
					(listing) =>
						listing.nftContract.toLowerCase() === address.toLowerCase()
				);
			}
			if (sellerAddress) {
				listings = listings.filter(
					(listing) =>
						listing.seller.toLowerCase() === sellerAddress.toLowerCase()
				);
			}
			for (let i = listings.length - 1; i >= 0; i--) {
				const listing = listings[i];
				const listingId = convertBigNumber(listing.listingId);
				const tokenId = convertBigNumber(listing.tokenId);
				const contract = new web3.eth.Contract<typeof NFT_CONTRACT.abi>(
					NFT_CONTRACT.abi,
					listing.nftContract
				);
				const metadata = await getTokenMetadata(tokenId, contract);

				setListings((state) => {
					if (state.find((s) => s.listingId === listingId)) return state;
					return [
						...state,
						{
							active: listing.active,
							listingId,
							metadata,
							nftContract: listing.nftContract,
							price: web3.utils.fromWei(listing.price, 'ether'),
							seller: listing.seller,
							tokenId,
						},
					];
				});
			}
		},
		[address]
	);

	useEffect(() => {
		if (!contract || !web3) return;
		if (reload) {
			setLoading(true);
			cb(contract, web3)
				.catch((err) => {
					console.log(err.message);
				})
				.finally(() => {
					setLoading(false);
				});
			setReload(false);
		}
	}, [cb, reload, contract, web3]);

	return {
		listings,
		loading,
		refresh: () => {
			setReload(true);
		},
	};
};

export const useNftContract = ({ address }: { address: string }) => {
	const { web3 } = useContract();
	const [nftContract, setNftContract] =
		useState<Contract<typeof NFT_CONTRACT.abi>>();

	useEffect(() => {
		if (!web3) return;
		const contract = new web3.eth.Contract<typeof NFT_CONTRACT.abi>(
			NFT_CONTRACT.abi,
			address
		);
		setNftContract(contract);
	}, [NFT_CONTRACT.abi, web3]);

	const getTokenMetadata = useCallback(
		async (tokenId: string) => {
			if (!nftContract) return {} as NftToken;
			const token = await nftContract.methods
				.tokenURI(tokenId)
				.call()
				.then((tokenURI) => ({
					tokenId,
					tokenURI: tokenURI as unknown as string,
				}));
			return fetchMetadata(token.tokenURI);
		},
		[nftContract]
	);
	const getUserNft = useCallback(
		async ({ userAddress }: { userAddress: string }) => {
			if (!nftContract) return [];
			const numNFTs = (await nftContract.methods
				.balanceOf(userAddress)
				.call()) as number;
			const nftPromises = [];
			for (let i = 0; i < numNFTs; i++) {
				nftPromises.push(
					nftContract.methods.tokenOfOwnerByIndex(userAddress, i).call()
				);
			}

			const nftIds = await Promise.all(nftPromises);
			const nftDataPromises = nftIds.map((id) => {
				return nftContract.methods
					.tokenURI(id)
					.call()
					.then((tokenURI) => ({ tokenId: id, tokenURI: tokenURI }));
			});
			const metadataUrls = await Promise.all(nftDataPromises);
			const metadataPromise = metadataUrls.map(async (data) => {
				const metadata = await fetch(data.tokenURI as unknown as string).then(
					(response) => {
						if (!response.ok) {
							throw new Error('Network response was not ok');
						}
						return response.json();
					}
				);
				if (metadata.image && typeof metadata.image === 'string') {
					metadata.image = metadata.image.replace(
						'ipfs://',
						'https://ipfs.io/ipfs/'
					);
				}
				return metadata;
			});

			return Promise.all(metadataPromise);
		},
		[nftContract]
	);

	return {
		nftContract,
		getUserNft,
		getTokenMetadata,
	};
};

async function fetchMetadata(tokenURI: string): Promise<NftTokenMetadata> {
	const metadata = await fetch(tokenURI).then((response) => {
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		return response.json();
	});
	if (metadata.image && typeof metadata.image === 'string') {
		metadata.image = metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
	}

	return metadata;
}

export const getTokenMetadata = async (
	tokenId: number,
	nftContract: Contract<typeof NFT_CONTRACT.abi>
) => {
	const token = await nftContract.methods
		.tokenURI(tokenId)
		.call()
		.then((tokenURI) => ({
			tokenId,
			tokenURI: tokenURI as unknown as string,
		}));
	return fetchMetadata(token.tokenURI);
};
