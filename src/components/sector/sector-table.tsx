import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { AlignType, Table } from '@/components/ui/table'
import ActionButtons from '@/components/common/action-buttons'
import Pagination from '@/components/ui/pagination'
import { MappedPaginatorInfo } from '@/types/index'

type RoundListProps = {
  sector: any[]
  paginatorInfo?: MappedPaginatorInfo | null
  onPagination?: (current: number) => void
}

const SectorTable = ({
  sector,
  paginatorInfo,
  onPagination,
}: RoundListProps) => {
  const { t } = useTranslation()
  const router = useRouter()

  const columns: any = [
    {
      title: t('table:table-item-round-name'),
      dataIndex: 'name',
      key: 'name',
      align: 'center' as AlignType,
    },

    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'id',
      align: 'center' as AlignType,
      render: (id: string) => {
        return <ActionButtons id={id} detailsUrl={`${router.asPath}/${id}`} />
      },
    },
  ]

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          columns={columns}
          data={sector}
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

export default SectorTable
