import { AlignType, Table } from '@/components/ui/table'
import { Attendance, MappedPaginatorInfo } from '@/types'
import Pagination from '../ui/pagination'
import { useTranslation } from 'react-i18next'
import { formatDate } from '@/utils/format-date'
import Badge from '../ui/badge/badge'
import { colorStatusAttendances } from '@/utils/colorBadge'
import { capitalizeWords } from '@/utils/functions'

type AttendancesListProps = {
  attendances?: Attendance[] | null
  paginatorInfo: MappedPaginatorInfo | null
  onPagination: (page: number) => void
}

const AttendanceList = ({
  attendances,
  paginatorInfo,
  onPagination,
}: AttendancesListProps) => {
  const { t } = useTranslation()

  const columns: any = [
    {
      title: 'Ubicación',
      dataIndex: ['user', 'sector', 'name'],
      key: 'name',
      align: 'center' as AlignType,
      width: 40,
      render: (text: any) => <span>{capitalizeWords(text)}</span>,
    },
    {
      title: t('table:table-headers-user'),
      dataIndex: 'user',
      key: 'user',
      align: 'center' as AlignType,
      width: 40,
      render: (user: any) => (
        <span>{capitalizeWords(user.firstName + ' ' + user.lastName)}</span>
      ),
    },
    {
      title: t('table:table-headers-check-in'),
      dataIndex: 'checkIn',
      key: 'checkIn',
      align: 'center' as AlignType,
      width: 74,
      render: (checkIn: string) => <span>{formatDate(checkIn)}</span>,
    },
    {
      title: t('table:table-headers-check-out'),
      dataIndex: 'checkOut',
      key: 'checkOut',
      align: 'center' as AlignType,
      width: 74,
      render: (checkOut: string) => (
        <span>{checkOut ? formatDate(checkOut) : ''}</span>
      ),
    },
    {
      title: t('table:table-headers-status'),
      dataIndex: 'status',
      key: 'status',
      align: 'center' as AlignType,
      width: 74,
      render: (status: string) => (
        <Badge
          //@ts-ignore
          text={
            status === 'ON_SITE' ? t('common:ON_SITE') : t('common:OFF_SITE')
          }
          color={colorStatusAttendances(status)}
        />
      ),
    },
  ]

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          rowKey="id"
          scroll={{ x: 1000 }}
          columns={columns}
          emptyText={t('common:text-no-data')}
          data={attendances ?? []}
        />
      </div>

      {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={
              //@ts-ignore
              paginatorInfo?.total
            }
            current={
              //@ts-ignore
              parseInt(paginatorInfo?.currentPage)
            }
            pageSize={
              //@ts-ignore
              parseInt(paginatorInfo?.perPage)
            }
            onChange={onPagination}
          />
        </div>
      )}
    </>
  )
}

export default AttendanceList
