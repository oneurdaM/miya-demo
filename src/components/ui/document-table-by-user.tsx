import { AlignType } from 'rc-table/lib/interface'
import { Table } from '../ui/table'
import ActionButtons from './action-buttons'
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
import Button from './button'
import { useTranslation } from 'react-i18next'
import { adminOnly, getAuthCredentials, hasAccess } from '@/utils/auth-utils'
import { switchDocumentType } from '@/types/typeDocuments'
import { useUserQuery } from '@/data/user'
import { switchJobPosition } from '@/types/users'
import UserJobposition from './userJobposition'

type Documents = {
  documentos: any[]
  title: string
  paginatorInfo?: MappedPaginatorInfo | null
  onPagination?: (current: number) => void
}

const DocumentTableByUser = ({
  documentos,
  title,
  paginatorInfo,
  onPagination,
}: Documents) => {
  const router = useRouter()
  const { t } = useTranslation()

  const {
    query: { id },
  } = router

  const { user } = useUserQuery({
    id: Number(id),
  })

  const { permissions } = getAuthCredentials()
  let permission = hasAccess(adminOnly, permissions)

  const columns: any = [
    {
      title: 'Tipo de documento',
      dataIndex: 'documentType',
      key: 'documentType',
      align: 'center' as AlignType,
      render: (text: string) => (
        <div>
          <>
            {text !== undefined ? switchDocumentType(text) : '----------------'}
          </>
        </div>
      ),
    },
    {
      title: 'Caducidad',
      dataIndex: 'validUntil',
      key: 'validUntil',
      align: 'center' as AlignType,
      render: (text: string) => (
        <div>
          <>
            {text !== undefined
              ? text?.length > 0
                ? format(new Date(text), "dd 'de' MMMM 'de' yyyy", {
                    locale: es,
                  })
                : ''
              : '----------------'}
          </>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'valid',
      key: 'valid',
      align: 'center' as AlignType,
      render: (valid: any) => (
        <>
          {valid !== undefined ? (
            <Badge
              text={valid === false ? 'Invalido' : 'Valido'}
              color={colorBadgeDocument(valid)}
            />
          ) : (
            '----------------'
          )}
        </>
      ),
    },
    {
      title: 'Acciones',
      dataIndex: 'id', //id Document
      key: 'id',
      align: 'center' as AlignType,
      render: (id: any, documents: any, index: any) => (
        <>
          {documents.moreFive !== false ? (
            <ActionButtons
              id={documents.id}
              validDocument={`validate?idDocument=${id}`}
              showFile={documents.filePath}
              deleteModalView={permission ? 'DELETE_DOCUMENT' : ''}
            />
          ) : null}
        </>
      ),
    },
  ]

  function handleBack() {
    router.back()
  }

  user?.jobPosition?.name
  return (
    <>
      <div className="flex items-center">
        {user && (
          <UserJobposition
            firstName={user?.firstName}
            lastName={user?.lastName}
            jobposition={user.jobPosition?.name}
          />
        )}

        <div className="w-full text-end my-3">
          <Button
            type="button"
            onClick={() => router.back()}
            className="bg-zinc-600 mx-3"
          >
            {t('form:form-button-back')}
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded shadow">
        <h3 className="border-b border-border-200 bg-light px-4 py-3 text-center font-semibold text-heading">
          {title}
        </h3>
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
          data={documentos}
          scroll={{ x: 1000 }}
        />
      </div>

      {
        //@ts-ignore
        !!paginatorInfo?.total && (
          <div className="flex items-center justify-end">
            <Pagination
              total={
                //@ts-ignore
                parseInt(paginatorInfo?.total)
              }
              current={
                //@ts-ignore
                parseInt(paginatorInfo?.currentPage)
              }
              pageSize={
                //@ts-ignore
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

export default DocumentTableByUser
