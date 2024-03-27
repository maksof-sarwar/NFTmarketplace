import { Button } from '@/components/ui/button';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from './ui/separator';

export function Cart() {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline" className="border dark:text-white">
					<span className="icon-[ph--bag-bold] text-lg"></span>
				</Button>
			</SheetTrigger>
			<SheetContent
				className="bg-white dark:bg-background dark:text-white max-w-[415px] w-full"
				overlayProps={{ className: 'bg-transparent' }}
			>
				<SheetHeader>
					<SheetTitle className="font-heading">Your Cart</SheetTitle>
					<div className="[&_h3]:font-heading flex justify-between items-center">
						<h3>Items</h3>
						<Button variant="ghost" className="hover:bg-white">
							Clear all
						</Button>
					</div>
					<Separator />
				</SheetHeader>
				<div className="h-[calc(100%_-_200px)]"></div>
				<SheetFooter>
					<div className="flex flex-col w-full">
						<div className="[&_h3]:font-heading flex justify-between items-center">
							<h3>Total:</h3>
							<Button variant="ghost" className="hover:bg-white">
								0 SEI
							</Button>
						</div>
						<Separator />
						<div className="[&_h3]:font-heading flex justify-between items-center">
							<h3>Fees:</h3>
							<Button variant="ghost" className="hover:bg-white">
								Pallet fee: 2%
							</Button>
						</div>
						<Separator />
						<SheetClose asChild>
							<Button type="submit" className="w-full">
								Save changes
							</Button>
						</SheetClose>
					</div>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
