import Pagination from '@/components/ui/pagination'
import { Table } from '@/components/ui/table'
import ActionButtons from '@/components/common/action-buttons'
import { MappedPaginatorInfo, SortOrder } from '@/types'
import { useMeQuery } from '@/data/user'
import { useTranslation } from 'next-i18next'
import { useIsRTL } from '@/utils/locals'
import { useState } from 'react'
import { NoDataFound } from '@/components/icons/no-data-found'
import TitleWithSort from '@/components/ui/title-with-sort'
import Badge from '../ui/badge/badge'
import Avatar from '../common/avatar'
import { UsersResponse } from '@/types/users'
import { AlignType } from 'rc-table/lib/interface'
import { getAuthCredentials, hasAccess, adminOnly } from '@/utils/auth-utils'

type IProps = {
  admins: UsersResponse[] | undefined
  paginatorInfo: MappedPaginatorInfo | null
  onPagination: (current: number) => void
  onSort: (current: any) => void
  onOrder: (current: string) => void
}
const AdminsList = ({
  admins,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  const { t } = useTranslation()
  const { alignLeft, alignRight } = useIsRTL()

  const { permissions } = getAuthCredentials()
  let permission = hasAccess(adminOnly, permissions)

  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder
    column: any | null
  }>({
    sort: SortOrder.Desc,
    column: null,
  })

  const onHeaderClick = (column: any | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc
      )

      onOrder(column)

      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      })
    },
  })

  const columns = [
    {
      align: 'center' as AlignType,
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
      width: 150,
      onHeaderCell: () => onHeaderClick('id'),
      render: (id: number) => `#: ${id}`,
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-title')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'id'
          }
          isActive={sortingObj.column === 'id'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'firstName',
      key: 'firstName',
      align: 'center' as AlignType,
      width: 250,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('name'),
      render: (
        name: string,
        { image, email, firstName, lastName }: UsersResponse
      ) => (
        <div className="flex items-center justify-center">
          <Avatar name={firstName} src={image ?? ''} />
          <div className="flex flex-col whitespace-nowrap font-medium ms-2">
            {firstName} {lastName}
            <span className="text-[13px] font-normal text-gray-500/80">
              {email}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: t('table:table-item-permissions'),
      dataIndex: 'role',
      key: 'role',
      width: 300,
      render: (role: any) => {
        return (
          <div className="flex flex-wrap gap-1.5 whitespace-nowrap justify-center">
            <span className="rounded bg-gray-200/50 px-2.5 py-1">{role}</span>
          </div>
        )
      },
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-status')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'banned'
          }
          isActive={sortingObj.column === 'banned'}
        />
      ),
      width: 100,
      className: 'cursor-pointer',
      dataIndex: 'banned',
      key: 'banned',
      align: 'center',
      onHeaderCell: () => onHeaderClick('banned'),
      render: (banned: boolean) => (
        <Badge
          textKey={!banned ? 'common:text-unblock' : 'common:text-block'}
          color={
            !banned
              ? 'bg-accent/10 !text-accent'
              : 'bg-status-failed/10 text-status-failed'
          }
        />
      ),
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: alignRight,
      width: 120,
      render: function Render(id: string, { banned }: any) {
        const { data } = useMeQuery()

        return (
          <>
            {data?.id?.toString() != id && (
              <ActionButtons
                id={id}
                userStatusAdmin={permission}
                isUserActiveAdmin={!banned}
                showMakeAdminButton={false}
              />
            )}
          </>
        )
      },
    },
  ]

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          // @ts-ignore
          columns={columns}
          emptyText={() => (
            <div className="flex flex-col items-center py-7">
              <NoDataFound className="w-52" />
              <div className="mb-1 pt-6 text-base font-semibold text-heading">
                {t('table:empty-table-data')}
              </div>
              <p className="text-[13px]">{t('table:empty-table-sorry-text')}</p>
            </div>
          )}
          data={admins}
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

export default AdminsList
