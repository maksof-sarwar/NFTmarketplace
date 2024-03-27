import { shortenAddress } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { CopyToClipboard } from './copy-to-clipboard';

interface ProfileProps {
	label: string;
	address: string;
	image?: string;
}
export function Profile({ address, label, image }: ProfileProps) {
	return (
		<div className="flex items-center gap-x-4">
			<Image
				src={
					'https://b6mkddthnxxzjsck2mt4naexo3reodcexzazwyf3yzs3bmjlx5sa.arweave.net/D5ihjmdt75TIStMnxoCXduJHDES-QZtgu8ZlsLErv2Q/4275.png'
				}
				width={55}
				height={55}
				alt=""
				className="rounded-xl"
			/>
			<div className="max-w-[calc(100%_-_55px)]">
				<h1 className="text-base  text-slate-500 font-bold">{label}</h1>
				<div className="flex max-w-full gap-0 items-center dark:text-white">
					<Link
						href={`/profile/${address}`}
						className="cursor-pointer truncate block break-words text-base font-bold hover:underline"
					>
						{shortenAddress(address)}
					</Link>
					<CopyToClipboard text={address} />
				</div>
			</div>
		</div>
	);
}
