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
import { AutoComplete } from './auto-complete';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function MobileSearch() {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	useEffect(() => {
		setOpen(false);
	}, [pathname]);
	return (
		<Sheet open={open} onOpenChange={() => setOpen(!open)}>
			<Button
				variant={'outline'}
				size={'icon'}
				onClick={() => setOpen(true)}
				className="lg:hidden block"
			>
				<span className="icon-[material-symbols--search] text-xl"></span>
			</Button>
			<SheetContent
				side="left"
				className="bg-white dark:bg-background dark:text-white max-w-[415px] w-full"
				overlayProps={{ className: 'bg-transparent' }}
			>
				<SheetHeader>
					<SheetTitle className="font-heading">Search Collection</SheetTitle>
					<Separator />
				</SheetHeader>
				<AutoComplete />
			</SheetContent>
		</Sheet>
	);
}
