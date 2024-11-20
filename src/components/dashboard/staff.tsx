import {Tab} from '@headlessui/react';

const StaffLayout = () => {
	const classNames = {
		basic:
			'lg:text-[1.375rem] font-semibold border-b-2 border-solid border-transparent lg:pb-5 pb-3 -mb-0.5',
		selected: 'text-accent hover:text-accent-hover border-current',
		normal: 'hover:text-black/80',
	};

	const tabList = [
		{
			title: 'common:sidebar-nav-item-my-environment',
			children: 'ShopList'
		},
		{
			title: 'common:sidebar-nav-item-message',
			children: 'Message'
		},
		{
			title: 'common:sidebar-nav-notice',
			children: 'Notice',
		}
	];

	return (
		<>
			<Tab.Group>

			</Tab.Group>
		</>
	);

}