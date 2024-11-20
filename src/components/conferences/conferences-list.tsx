
import {AlignType,Table} from '../ui/table'
import Pagination from '../ui/pagination'
import TitleWithSort from '../ui/title-with-sort'
import {useTranslation} from 'react-i18next'
import {SortOrder} from '@/types'
import {useState} from 'react'

type ConferencesListProps = {
	conferences: any[]
	paginatorInfo: any
	onPagination: (current: number) => void
	onSort: (current: any) => void;
	onOrder: (current: string) => void;
}
const ConferencesList = ({conferences,paginatorInfo,onPagination,onSort,onOrder}: ConferencesListProps) => {
	const {t} = useTranslation();

	const [sortingObj,setSortingObj] = useState<{
		sort: SortOrder;
		column: string | null;
	}>({
		sort: SortOrder.Desc,
		column: null,
	});

	const onHeaderClick = (column: string | null) => ({
		onClick: () => {
			onSort((currentSortDirection: SortOrder) =>
				currentSortDirection === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
			);
			onOrder(column!);

			setSortingObj({
				sort:
					sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
				column: column,
			});
		},
	});

	const columns: any = [
		{
			title: (
				<TitleWithSort
					title={'ID'}
					ascending={
						sortingObj.sort === SortOrder.Asc && sortingObj.column === 'id'
					}
					isActive={sortingObj.column === 'id'}
				/>
			),
			className: 'cursor-pointer',
			dataIndex: 'id',
			key: 'id',
			align: 'left' as AlignType,
			width: 140,
			onHeaderCell: () => onHeaderClick('id'),
			render: (id: number) => `#${t('table:table-item-id')}: ${id}`,
		},
		{
			title: t('table:table-item-host-name'),
			dataIndex: 'name',
			key: 'name',
			align: 'center' as AlignType,
			render: (text: string) => <a>{text}</a>,
		},
		{
			title: t('table:start-date'),
			dataIndex: 'start_date',
			key: 'start_date',
			align: 'center' as AlignType,
		},
		{
			title: t('table:end-date'),
			dataIndex: 'end_date',
			key: 'end_date',
			align: 'center' as AlignType,
		},
		{
			title: t('table:table-item-actions'),
			dataIndex: 'id',
			key: 'id',
			align: 'center' as AlignType,
			render: (id: number) => (
				<div className="flex justify-center">
					<button
						className="p-2 text-indigo-600 hover:text-indigo-900"
						onClick={() => { }}
					>
						Edit
					</button>
					<button
						className="p-2 text-red-600 hover:text-red-900"
						onClick={() => { }}
					>
						Delete
					</button>
				</div>
			),
		}
	]

	return (
		<>
			<div className="mb-6 overflow-hidden rounded shadow">
				<Table columns={columns} data={conferences} rowKey={'id'} emptyText={t('common:empty-list-conferences')} />
			</div>

			{!!paginatorInfo?.total && (
				<div className="flex items-center justify-end">
					<Pagination
						total={paginatorInfo.total}
						current={paginatorInfo.currentPage}
						pageSize={paginatorInfo.perPage}
						onChange={onPagination}
					/>
				</div>
			)}
		</>
	);
}

export default ConferencesList;