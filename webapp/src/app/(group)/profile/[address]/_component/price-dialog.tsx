import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { gasPrice, useContract } from '@/hooks/use-contract';
import { toast } from '@/lib/toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { ComponentProps } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
interface PriceDialogProps extends ComponentProps<typeof Button> {
	address: string;
	tokenId: string;
}

const Schema = z.object({
	price: z.number().min(0.001).default(5),
});
type Schema = z.infer<typeof Schema>;
export function PriceDialog({
	address,
	tokenId,
	className,
	...props
}: PriceDialogProps) {
	const { contract, account, web3, smartContract } = useContract();
	const form = useForm<Schema>({
		resolver: zodResolver(Schema),
	});
	const onSubmit = async (value: Schema) => {
		if (!web3) return;
		const nftContractInstance = new web3.eth.Contract(
			smartContract.MARKET_PLACE.abi,
			address
		);
		const approvedAddress = (await nftContractInstance?.methods
			.getApproved(tokenId)
			.call()) as string;

		if (
			approvedAddress?.toLowerCase() ===
			smartContract.MARKET_PLACE.contractAddress.toLowerCase()
		) {
			await listNFT(value.price);
		} else {
			await nftContractInstance?.methods
				.approve(smartContract.MARKET_PLACE.contractAddress, tokenId)
				.send({ from: account, gasPrice: gasPrice, gas: '500000' });
			toast({
				status: 'info',
				description: ` Approval set for NFT ${tokenId} in contract ${smartContract.MARKET_PLACE.contractAddress}.`,
			});
			await listNFT(value.price);
		}
	};

	async function listNFT(price: number) {
		await contract?.methods
			.listNFT(address, tokenId, web3!.utils.toWei(price, 'ether'))
			.send({ from: account, gasPrice: gasPrice, gas: '500000' });
		toast({
			status: 'info',
			description: 'NFT listed successfully',
		});
	}

	return (
		<Form {...form}>
			<Dialog>
				<DialogTrigger asChild>
					<Button
						variant={'default'}
						className=" border-none rounded-t-none w-full"
					>
						List Nft
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Listing Price</DialogTitle>
					</DialogHeader>
					<FormField
						control={form.control}
						name="price"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor="price" className="text-right">
									Price
								</FormLabel>
								<FormControl>
									<Input
										id="price"
										min={1}
										type="number"
										className="col-span-3"
										onChange={(e) =>
											field.onChange(Number(e.currentTarget.value))
										}
										value={field.value}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<DialogFooter>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<Button type="submit">List</Button>
						</form>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</Form>
	);
}

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { convertBigNumber } from '@/lib/utils';
import { NftToken } from '@/types';

export function CancelListing({ listingId }: { listingId: string }) {
	const { contract, account } = useContract();
	const cancelListing = async () => {
		await contract?.methods
			.cancelListing(convertBigNumber(listingId))
			.send({ from: account, gasPrice: gasPrice, gas: '500000' });
		toast({
			status: 'info',
			description: 'Listing canceled successfully',
		});
	};
	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant="destructive"
					className="  border-none  rounded-t-none w-full"
				>
					Cancel Listing
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={cancelListing}>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
