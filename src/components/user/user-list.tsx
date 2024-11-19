import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

import TitleWithSort from '@/components/ui/title-with-sort'
import Badge from '@/components/ui/badge/badge'
import { AlignType, Table } from '@/components/ui/table'
import ActionButtons from '@/components/common/action-buttons'
import Pagination from '@/components/ui/pagination'
import Avatar from '@/components/common/avatar'

import { JobPosition, Role, UsersResponse } from '@/types/users'
import { MappedPaginatorInfo, SortOrder } from '@/types/index'
import { Shift } from '@/types/suggestions'
import { jobPositionFormat } from '@/utils/job-position-format'
import { getAuthCredentials, hasAccess, adminOnly } from '@/utils/auth-utils'
import { capitalizeWords } from '@/utils/functions'

type UserListProps = {
  users: UsersResponse[]
  paginatorInfo?: MappedPaginatorInfo | null
  onPagination?: (current: number) => void
}
const UserList = ({ users, paginatorInfo, onPagination }: UserListProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder
    column: any | null
  }>({
    sort: SortOrder.Desc,
    column: null,
  })
  const { permissions } = getAuthCredentials()
  let permission = hasAccess(adminOnly, permissions)

  const onHeaderClick = (column: any | null) => ({
    onClick: () => {
      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      })
    },
  })

  const columns: any = [
    // {
    //   title: (
    //     <TitleWithSort
    //       title={'ID'}
    //       ascending={
    //         sortingObj.sort === SortOrder.Asc && sortingObj.column === 'id'
    //       }
    //       isActive={sortingObj.column === 'id'}
    //     />
    //   ),
    //   className: 'cursor-pointer',
    //   dataIndex: 'id',
    //   key: 'id',
    //   align: 'center' as AlignType,
    //   width: 150,
    //   onHeaderCell: () => onHeaderClick('id'),
    //   render: (id: number) => `#ID: ${id}`,
    // },
    {
      title: t('table:table-item-job-position'),
      dataIndex: 'jobPosition',
      key: 'jobPosition',
      align: 'center' as AlignType,
      render: (jobPosition: any) => (
        <span>{capitalizeWords(jobPosition.name)}</span>
      ),
    },
    {
      title: t('table:table-item-shift'),
      dataIndex: 'shift',
      key: 'shift',
      align: 'center' as AlignType,
      render: (shift: Shift) => <span>{t(shift?.name)}</span>,
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
      dataIndex: 'name',
      key: 'name',
      align: 'left' as AlignType,
      width: 250,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('name'),
      render: (
        _data: any,
        { firstName, lastName, image, email }: UsersResponse
      ) => (
        <div className="flex items-center">
          <Avatar name={firstName} src={image ?? ''} />
          <div className="flex flex-col whitespace-nowrap font-medium ms-2">
            {capitalizeWords(firstName + ' ' + lastName)}
            <span className="text-[13px] font-normal text-gray-500/80">
              {email}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: t('table:table-item-permissions'),
      dataIndex: 'permissions',
      key: 'permissions',
      align: 'center' as AlignType,
      render: (_: any, user: any) => {
        return (
          <span key={user.id} className="rounded bg-gray-200/50 px-2.5 py-1">
            {user.role}
          </span>
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
          textKey={!banned ? 'common:text-active' : 'common:text-inactive'}
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
      width: 250,
      key: 'id',
      align: 'center' as AlignType,
      render: (id: string, user: UsersResponse) => {
        const { banned, role } = user // Extraer las propiedades de user si necesitas utilizarlas
        return (
          <ActionButtons
            id={id}
            userStatus={permission ? true : false}
            isUserActive={!banned}
            // deleteModalView={'DELETE_USER'}
            detailsUrl={`${router.asPath}/${id}`}
            role={role as Role}
            showRounds={`${router.asPath}/rounds/${id}`}
            exportCsv={{ id: id, isEnable: false }}
            // showDocuments={`${router.asPath}/documents/${id}`}
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
          data={users}
          rowKey={'id'}
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

export default UserList
