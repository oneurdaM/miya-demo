import cn from 'classnames';

import FolderIcon from '@/components/icons/folder-solid';
import PDFIcon from '@/components/icons/pdf-solid';
import DocIcon from '@/components/icons/doc-solid';
import Link from '@/components/ui/link';

import {useScrollableSlider} from '@/hooks/use-scrollable-slider';
import Button from '../ui/button';
import {ArrowNext} from '../icons/arrow-next';
import {ArrowPrev} from '../icons/arrow-prev';

const mockdata = [
	{
		id: 1,
		file: {
			name: 'Employee Sheet',
			image: FolderIcon,
		},
	},
	{
		id: 2,
		file: {
			name: 'Employee history.pdf',
			image: PDFIcon,
		},
	},
	{
		id: 3,
		file: {
			name: 'Final Changes.doc',
			image: DocIcon,
		},
	},
	{
		id: 4,
		file: {
			name: 'Final Changes.doc',
			image: DocIcon,
		},
	},
	{
		id: 5,
		file: {
			name: 'Final Changes.doc',
			image: DocIcon,
		},
	},
	{
		id: 6,
		file: {
			name: 'Employee Sheet',
			image: FolderIcon,
		},
	},
	{
		id: 7,
		file: {
			name: 'Employee history.pdf',
			image: PDFIcon,
		},
	},
];

export function QuickAccessCard({
	item,
	className
}: {item: any,className?: string}) {

	return (
		<div className={
			cn(className,
				'relative flex flex-col items-center justify-center rounded-lg bg-gray-50 p-7 dark:bg-gray-100/50'
			)}>
			{item?.file?.image && (
				<div className="w-14">
					<item.file.image />
				</div>
			)}
			<p className="mt-5 w-full truncate text-center text-sm font-medium text-gray-700">
				{item?.file?.name}
			</p>
		</div>
	);
}

export default function QuickAccess({className}: {className?: string}) {
	const {
		sliderEl,
		sliderPrevBtn,
		sliderNextBtn,
		scrollToTheRight,
		scrollToTheLeft,
	} = useScrollableSlider();

	return (
		<div className={className}>
			<div className="col-span-full mb-3 flex items-center justify-between 2xl:mb-5">
				<h3 className='text-lg font-semibold xl:text-xl'>
					Quick Access
				</h3>
				<Link
					href={'/file-manager'}
					className="text-sm font-medium text-gray-900 hover:underline"
				>
					View all
				</Link>
			</div>
			<div className="relative">
				<Button
					title="Prev"
					variant="custom"
					ref={sliderPrevBtn}
					onClick={() => scrollToTheLeft()}
					className="!absolute left-0 top-0 z-10 !h-full w-14 !justify-start rounded-none bg-gradient-to-r  from-gray-0 via-gray-0/70  to-transparent px-0 text-gray-500 hover:text-gray-900 3xl:hidden dark:from-gray-50 dark:via-gray-50/70"
				>
					<ArrowPrev className="h-5 w-5" />
				</Button>
				<div className="w-full overflow-hidden">
					<div
						ref={sliderEl}
						className="custom-scrollbar-x grid grid-flow-col gap-5 overflow-x-auto scroll-smooth"
					>
						{mockdata.map((item) => {
							return <QuickAccessCard key={item.id} item={item} />;
						})}
					</div>
				</div>
				<Button
					title="Next"
					variant="custom"
					ref={sliderNextBtn}
					onClick={() => scrollToTheRight()}
					className="!absolute right-0 top-0 z-10 !h-full w-14 !justify-end rounded-none bg-gradient-to-l from-white via-white to-transparent px-0 text-gray-500  hover:text-gray-900 3xl:hidden dark:from-gray-50 dark:via-gray-50/70"
				>
					<ArrowNext className="h-5 w-5" />
				</Button>
			</div>
		</div>
	);
}