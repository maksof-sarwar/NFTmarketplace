'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CollectionFormSchema } from './schema';
import { useContract } from '@/hooks/use-contract';
import { Textarea } from '@/components/ui/textarea';
import { DragZone } from '@/components/drag-zone';
import { api } from '@/trpc/react';
import { Web3 } from 'web3';
import contract from '@/../contract';
import { toast } from '@/lib/toast';
import { useState } from 'react';
export function CollectionForm() {
	const { mutateAsync: createCollection, isPending } =
		api.collection.create.useMutation();
	const [loading, setLoading] = useState(false);
	const { exec } = useContract();
	const form = useForm<CollectionFormSchema>({
		// resolver: zodResolver(CollectionFormSchema),
	});
	const onSubmit = async (value: CollectionFormSchema) => {
		setLoading(true);
		const {
			contractAddress,
			creatorAddress,
			feePercent,
			metadata,
			totalSupply,
			slug,
			banner,
			logo,
		} = value;
		try {
			const tx = await exec(
				'setCollectionInfo',
				'send',
				{},
				contractAddress,
				creatorAddress,
				feePercent,
				totalSupply
			);
			if (tx) {
				await createCollection({
					address: contractAddress,
					banner,
					slug,
					logo,
					metadata: {
						...metadata,
						totalSupply,
						creatorAddress,
						feePercent,
						contractAddress,
					},
				});
				toast({
					status: 'success',
					description: 'Successfully created',
				});
			}

			// await createCollection({
			// 	address: contractAddress,
			// 	banner,
			// 	logo,
			// 	metadata: {
			// 		...metadata,
			// 		totalSupply,
			// 		creatorAddress,
			// 		feePercent,
			// 		contractAddress,
			// 		tx: 'random',
			// 	},
			// });
			// toast({
			// 	status: 'success',
			// 	description: 'Successfully created',
			// });
		} finally {
			setLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="grid grid-cols-2 gap-4"
			>
				<FormField
					control={form.control}
					name="metadata.name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Collection Name</FormLabel>
							<FormControl>
								<Input placeholder="collection name" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="slug"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Collection Slug</FormLabel>
							<FormControl>
								<Input placeholder="collection slug" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="contractAddress"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Contract Address</FormLabel>
							<FormControl>
								<Input placeholder="contract address" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="feePercent"
					render={({ field: { onChange, ...field } }) => (
						<FormItem>
							<FormLabel>Free Percent %</FormLabel>
							<FormControl>
								<Input
									type="number"
									onChange={(e) => onChange(Number(e.currentTarget.value))}
									placeholder="fee percent"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="totalSupply"
					render={({ field: { onChange, ...field } }) => (
						<FormItem>
							<FormLabel>Total Supply</FormLabel>
							<FormControl>
								<Input
									type="number"
									onChange={(e) => onChange(Number(e.currentTarget.value))}
									{...field}
									placeholder="total supply"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="creatorAddress"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Creator Address</FormLabel>
							<FormControl>
								<Input placeholder="creator address" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="metadata.telegram"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Telegram</FormLabel>
							<FormControl>
								<Input placeholder="telegram url" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="metadata.web"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Web</FormLabel>
							<FormControl>
								<Input placeholder="web url" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="metadata.discord"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Discord</FormLabel>
							<FormControl>
								<Input placeholder="discord url" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="metadata.twitter"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Twitter</FormLabel>
							<FormControl>
								<Input placeholder="twitter url" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="metadata.description"
					render={({ field }) => (
						<FormItem className="col-span-2">
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea placeholder="description" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="logo"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Logo</FormLabel>
							<FormControl>
								<DragZone
									onRemove={() => field.onChange(undefined)}
									onDrop={(file) => field.onChange(file)}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="banner"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Banner</FormLabel>
							<FormControl>
								<DragZone
									onRemove={() => field.onChange(undefined)}
									onDrop={(file) => field.onChange(file)}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button
					isLoading={isPending || loading}
					type="submit"
					className="col-span-2"
				>
					Submit
				</Button>
			</form>
		</Form>
	);
}
