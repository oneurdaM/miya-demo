import { useTranslation } from 'react-i18next'

import { Table } from '@/components/ui/table'
import ActionButtons from '@/components/ui/action-buttons'
import Pagination from '@/components/ui/pagination'

import { Routes } from '@/config/routes'

import { MappedPaginatorInfo } from '@/types'
import { Shift } from '@/types/suggestions'
import { getAuthCredentials, hasAccess, adminOnly } from '@/utils/auth-utils'
import { formatDate } from '@/utils/format-date'

type ShiftsListProps = {
  shifts: Shift[]
  paginatorInfo: MappedPaginatorInfo | null
  onPagination: (current: number) => void
}

const ShiftsList = ({
  shifts,
  paginatorInfo,
  onPagination,
}: ShiftsListProps) => {
  const { permissions } = getAuthCredentials()
  let permission = hasAccess(adminOnly, permissions)

  const { t } = useTranslation()

  const columns: any = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      with: 50,
      align: 'center',
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: 'Inicio',
      dataIndex: 'start',
      key: 'start',
      align: 'center',
      render: (start: string) => {
        return <span className="text-primary-500">{formatDate(start)}</span>
      },
    },
    {
      title: 'Fin',
      dataIndex: 'end',
      key: 'end',
      align: 'center',
      render: (end: string) => {
        return <span className="text-primary-500">{formatDate(end)}</span>
      },
    },
    // {
    // 	title: 'Usuarios',
    // 	dataIndex: 'users',
    // 	key: 'users',
    // 	align: 'center',
    // 	render: (users: any) => {
    // 		return users.map((user: any) => user.name).join(', ')
    // 	},
    // },
    {
      title: 'Acciones',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      render: (id: number) => {
        return (
          <ActionButtons
            id={id.toString()}
            detailsUrl={`${Routes.shifts.details({ id: id.toString() })}`}
            deleteModalView={permission ? 'DELETE_SHIFT' : ''}
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
          emptyText={t('common:text-no-data')}
          data={shifts}
          rowKey="id"
          scroll={{ x: 900 }}
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

export default ShiftsList
