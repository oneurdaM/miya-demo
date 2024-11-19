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

import { MAXDOCUMENTS } from '@/utils/constants'
import Button from './button'
import { ProgressBar } from './posgress-bar'
import { capitalizeWords } from '@/utils/functions'

type UserListProps = {
  users: UsersResponse[]
  paginatorInfo?: MappedPaginatorInfo | null
  onPagination?: (current: number) => void
}
const DocumentoTableUser = ({
  users,
  paginatorInfo,
  onPagination,
}: UserListProps) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder
    column: any | null
  }>({
    sort: SortOrder.Desc,
    column: null,
  })

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
    {
      title: t('table:table-item-shift'),
      dataIndex: 'shift',
      key: 'shift',
      align: 'center' as AlignType,
      render: (shift: Shift) => <span>{t(shift?.name)}</span>,
    },
    {
      title: t('table:table-item-job-position'),
      dataIndex: 'jobPosition',
      key: 'jobPosition',
      align: 'center' as AlignType,
      render: (text: any) => <span>{text.name}</span>,
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
      title: t('table:table-item-posgress'),
      dataIndex: 'name',
      width: 250,
      key: 'id',
      align: 'center' as AlignType,
      render: (_data: any, { jobPosition, documents }: UsersResponse) => (
        <div className="p-4 w-3/4 mx-auto">
          <ProgressBar
            value={documents?.length}
            max={jobPosition?.requireDocuments.length}
          />
        </div>
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
          <ActionButtons id={id} addDocumentUser={'addDocument?userId=' + id} />
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

      <div className="w-full text-end mt-10">
        <Button
          type="button"
          onClick={() => router.back()}
          className="bg-zinc-600 mx-3"
        >
          {t('form:form-button-back')}
        </Button>
      </div>
    </>
  )
}

export default DocumentoTableUser
