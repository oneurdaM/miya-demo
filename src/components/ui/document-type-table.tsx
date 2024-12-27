import {AlignType, Table} from './table'
import {MappedPaginatorInfo} from '@/types/index'
import Pagination from '@/components/ui/pagination'
import {NoDataFound} from '../icons/no-data-found'
import Avatar from '../common/avatar'

import ButtonIcon from './button-icon'
import {ChevronUpIcon} from '../icons/chevron-up'
import ExpandedContentDocuments from '../documents/expandable'
import {ChevronDown} from '../icons/chevronDownIcon'
import ActionButtons from './action-buttons'

type Documents = {
  documents: any[]
  title: string
  paginatorInfo?: MappedPaginatorInfo | null
  onPagination?: (current: number) => void
}

const DocumentTableType = ({
  documents,
  title,
  paginatorInfo,
  onPagination,
}: Documents) => {
  console.log(documents)
  const columns: any = [
   
    {
      title: 'Nombre del Documento',
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (text: string) => {
        return <div className='text-center'>{text}</div>;  // Asegúrate de retornar el JSX
      }
    },
    {
      title: 'Acciones',
      dataIndex: 'actions',
      key: 'actions',
      align: 'center' as AlignType,
      render: (_id: number, data: any) => {
        return (
          <ActionButtons
            id={data?.id}
            deleteModalView={ 'DELETE_DOCUMENT'}
          />
        )
      },
    },
  ];


  return (
    <>
      <div className="overflow-hidden rounded shadow">
        <h3 className="border-b border-border-200 bg-light px-4 py-3 text-center font-semibold text-heading">
          {title}
        </h3>

        <Table
          columns={columns}
          emptyText={() => (
            <div className="flex flex-col items-center py-7">
              <NoDataFound className="w-52" />
              <div className="mb-1 pt-6 text-base font-semibold text-heading">
                No hay datos
              </div>
              <p className="text-[13px]">Lo siento, no se encontraron datos.
              </p>
            </div>
          )}
          data={documents}
          rowKey="userId"
          scroll={{x: 1000}}

        />

      </div>

      {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={
              paginatorInfo?.total
            }
            current={
              paginatorInfo?.currentPage
            }
            pageSize={
              paginatorInfo?.perPage
            }
            onChange={onPagination}
          />
        </div>
      )
      }
    </>
  )
}

export default DocumentTableType
