import { useState } from 'react'
import { AlignType } from 'rc-table/lib/interface'

import { Table } from '@/components/ui/table'

import { SuggestionsResponse } from '@/types/suggestions'
import TitleWithSort from '../ui/title-with-sort'
import { Routes } from '@/config/routes'
import Pagination from '../ui/pagination'
import { MappedPaginatorInfo, SortOrder } from '@/types'
import ActionButtons from '../ui/action-buttons'
import { StarIcon } from '../icons/star-icon'
import { getAuthCredentials, hasAccess, adminOnly } from '@/utils/auth-utils'

type SuggestionListProps = {
  suggestions: SuggestionsResponse[]
  paginatorInfo: MappedPaginatorInfo | null
  onPagination: (current: number) => void
}
const SuggestionList = ({
  suggestions,
  paginatorInfo,
  onPagination,
}: SuggestionListProps) => {
  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder
    column: string | null
  }>({
    sort: SortOrder.Desc,
    column: null,
  })

  const { permissions } = getAuthCredentials()
  let permission = hasAccess(adminOnly, permissions)

  const onHeaderClick = (column: string | null) => ({
    onClick: () => {
      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      })
    },
  })

  const columns: any = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      with: 50,
      align: 'center' as AlignType,
    },
    {
      title: 'Sugerencia',
      dataIndex: 'content',
      key: 'content',
      align: 'center' as AlignType,
      render: (suggestion: string) => {
        return (
          <div className="flex items-center text-center justify-center">
            <div className="flex flex-col">
              <span className="text-ellipsis text-sm font-semibold text-heading">
                {suggestion}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      title: (
        <TitleWithSort
          title="Score"
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'rating'
          }
          isActive={sortingObj.column === 'rating'}
        />
      ),
      key: 'rating',
      className: 'cursor-pointer',
      align: 'center' as AlignType,
      width: 300,
      onHeaderCell: () => onHeaderClick('rating'),
      render: (record: any) => (
        <div className="inline-flex shrink-0 items-center rounded-full border border-accent px-3 py-0.5 text-base text-accent">
          {record?.rating}
          <StarIcon className="h-3 w-3 ms-1" />
        </div>
      ),
    },
    {
      title: (
        <TitleWithSort
          title="Fecha de creación"
          ascending={true}
          isActive={false}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center' as AlignType,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Acciones',
      dataIndex: 'id',
      key: 'id',
      align: 'center' as AlignType,
      render: (id: string) => {
        return (
          <ActionButtons
            id={id}
            detailsUrl={`${Routes.suggestions.details({ id })}`}
            deleteModalView={permission ? 'DELETE_SUGGESTION' : ''}
          />
        )
      },
    },
  ]
  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          columns={columns}
          rowClassName="align-top"
          emptyText={'No hay sugerencias'}
          data={suggestions}
          rowKey="id"
          scroll={{ x: 1000 }}
        />
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
  )
}

export default SuggestionList
