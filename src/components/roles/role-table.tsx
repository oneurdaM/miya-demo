import { AlignType } from 'rc-table/lib/interface'
import { Table } from '../ui/table'
import ActionButtons from '../ui/action-buttons'
import { Routes } from '@/config/routes'
import Badge from '../ui/badge/badge'
import { colorBadgeDocument } from '@/utils/colorBadge'
import { useRouter } from 'next/router'
import { MappedPaginatorInfo } from '@/types/index'
import Pagination from '@/components/ui/pagination'
import { dropdownIndicatorCSS } from 'react-select/dist/declarations/src/components/indicators'
import { NoDataFound } from '../icons/no-data-found'
import { formatDate } from '@/utils/format-date'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { capitalizeWords } from '@/utils/functions'

const RoleTable = ({ data }: any) => {
  const router = useRouter()

  const columns: any = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      align: 'center' as AlignType,
    },
    {
      title: 'Posición de trabajo',
      dataIndex: 'name',
      key: 'name',
      align: 'center' as AlignType,
      redner: (text: any) => <span>{capitalizeWords(text)}</span>,
    },
    {
      title: 'Acciones',
      dataIndex: 'id', //id Document
      key: 'id',
      align: 'center' as AlignType,
      render: (id: any, record: any) => (
        <>
          <ActionButtons
            id={id}
            addDocuments={`${router.asPath}/${id}`}
            editUrl={Routes.roles.edit({ id })}
            deleteModalView={'DELETE_JOBPOSITION'}
          />
        </>
      ),
    },
  ]

  const rowExpandable = (record: any) => record.children?.length
  return (
    <>
      <div className="overflow-hidden rounded shadow">
        <Table
          columns={columns}
          emptyText={() => (
            <div className="flex flex-col items-center py-7">
              <NoDataFound className="w-52" />
              <div className="mb-1 pt-6 text-base font-semibold text-heading"></div>
              <p className="text-[13px]"></p>
            </div>
          )}
          rowKey={'id'}
          data={data}
          scroll={{ x: 1000 }}
          expandable={{
            rowExpandable: rowExpandable,
            expandedRowRender: () => '',
          }}
        />
      </div>
    </>
  )
}

export default RoleTable
