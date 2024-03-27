'use client';
import { Currency } from '@/components/currency';
import { TimeAgo } from '@/components/time-ago';
import { Button } from '@/components/ui/button';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { formatTokenName } from '@/lib/utils';
import { api } from '@/trpc/react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from './ui/card';
import { useContract } from '@/hooks/use-contract';

export function Notification() {
	const { account } = useContract();
	const { mutateAsync, isPending } =
		api.userProfile.markNotificationAsSeen.useMutation();
	const { data: notifications = [], refetch } =
		api.userProfile.getUserNotification.useQuery({ userAddress: account });

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline" size="icon">
					<Image
						alt="light"
						src="/svg/notification.svg"
						className="text-primary w-5   cursor-pointer"
						width={40}
						height={40}
					/>
				</Button>
			</SheetTrigger>
			<SheetContent
				className="bg-primary text-white"
				overlayProps={{ className: 'bg-primary/70' }}
			>
				<SheetHeader>
					<SheetTitle className="font-heading uppercase">
						Notification
					</SheetTitle>
					<div className="[&_h3]:font-heading flex justify-between items-center">
						<h3></h3>
						<Button
							disabled={notifications.length === 0}
							onClick={async () => {
								await mutateAsync({
									notificationIds: notifications.map((n) => n.id),
								});
								refetch();
							}}
							variant="link"
							className="text-white p-0"
						>
							Clear all
						</Button>
					</div>
				</SheetHeader>

				<div className="space-y-4">
					{notifications.length === 0 ? (
						<div className="text-center text-white uppercase">
							No notifications
						</div>
					) : (
						notifications.map(({ activity, id }) => (
							<Card className="flex gap-2 group  relative items-center p-2 font-heading">
								<Image
									src={activity.collectionToken?.image!}
									alt="img"
									width={100}
									height={100}
									className="w-14 rounded"
								/>
								<div className="flex flex-col gap-0">
									<div className="space-x-2">
										<Link
											href={`/collection/${activity.contractAddress}/${activity.tokenId}`}
											className="whitespace-nowrap hover:underline"
										>
											{formatTokenName(
												activity.collectionToken?.name!,
												activity.tokenId
											)}
										</Link>
										<span className="inline-flex gap-1">
											<span className="font-sans font-thin">sold for</span>{' '}
											<Currency
												className="font-heading"
												value={activity.price}
											/>
										</span>
									</div>
									<TimeAgo
										datetime={activity.createdAt}
										className="font-sans font-thin uppercase text-xs"
									/>
								</div>
								<Button
									onClick={async () => {
										await mutateAsync({ notificationIds: [id] });
										refetch();
									}}
									variant="link"
									size="icon"
									className="absolute top-0 right-0 hidden group-hover:block"
								>
									<span className="icon-[entypo--cross]"></span>
								</Button>
							</Card>
						))
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}
