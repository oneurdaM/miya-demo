import {Table} from '../ui/table'
import {MappedPaginatorInfo} from '@/types/index'
import Pagination from '@/components/ui/pagination'
import {NoDataFound} from '../icons/no-data-found'
import Avatar from '../common/avatar'

import ButtonIcon from './button-icon'
import {ChevronUpIcon} from '../icons/chevron-up'
import ExpandedContentDocuments from '../documents/expandable'
import {ChevronDown} from '../icons/chevronDownIcon'

type Documents = {
  documents: any[]
  title: string
  paginatorInfo?: MappedPaginatorInfo | null
  onPagination?: (current: number) => void
}

const DocumentTable = ({
  documents,
  title,
  paginatorInfo,
  onPagination,
}: Documents) => {
  const columns: any = [
    {
      title: 'ID Usuario',
      dataIndex: 'userId',
      key: 'userId',
      align: 'center',
      width: 200,
    },
    {
      title: 'Nombre de Usuario',
      dataIndex: 'userName',
      key: 'userName',
      width: 250,
      render: (userName: any) => (
        <div className="flex items-center">
          <Avatar name={userName} />
          <div className="flex flex-col whitespace-nowrap font-medium ms-2">
            {userName}
          </div>
        </div>
      ),
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
          expandable={{
            expandRowByClick: false,
            showExpandColumn: true,
            expandedRowRender: documents.some((doc) => doc.children)
              ? undefined // Deshabilitar si hay hijos
              : (document,index) => (
                <ExpandedContentDocuments
                  key={`document-extra-data-row-${document.id}`}
                  onClose={() => console.log('close',index)}
                  record={document}
                />
              ),

            expandIcon: ({expanded,record,onExpand}) => {
              return (
                <>
                  <ButtonIcon
                    icon
                    ={expanded ? <ChevronUpIcon /> : <ChevronDown />}
                    onClick={(e: any) => onExpand(record,e)}
                  />
                </>
              );
            },
          }}
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

export default DocumentTable
