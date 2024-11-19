import {useEffect} from 'react'
import {AlignType} from 'rc-table/lib/interface'
import {useRouter} from 'next/router'
import {useTranslation} from 'react-i18next'
import {Fancybox} from '@fancyapps/ui'
import Image from 'next/image'

import {Table} from '@/components/ui/table'
import Pagination from '@/components/ui/pagination'
import ActionButtons from '@/components/ui/action-buttons'
import {formatDateCabos} from '@/utils/format-date'
import Button from '@/components/ui/button'
import Badge from '@/components/ui/badge/badge'

import {colorBadge} from '@/utils/colorBadge'
import {getAuthCredentials,hasAccess,adminOnly} from '@/utils/auth-utils'
import {getAlertStatus} from '@/utils/alert-status'
import {capitalizeWords} from '@/utils/functions'

import {Alert,AlertStatus} from '@/types/alerts'
import {UsersResponse} from '@/types/users'
import {MappedPaginatorInfo} from '@/types/index'

import {Routes} from '@/config/routes'

type AlertListProps = {
  alerts: Alert[] | null | undefined
  paginatorInfo?: MappedPaginatorInfo | null
  onPagination?: (page: number) => void
  seletedAlert?: (alert: Alert) => void
}

const AlertList = ({alerts,paginatorInfo,onPagination}: AlertListProps) => {
  const {t} = useTranslation()
  const router = useRouter()

  useEffect(() => {
    Fancybox.bind('[data-fancybox="gallery"]',{})
  },[])

  const {permissions} = getAuthCredentials()
  const permission = hasAccess(adminOnly,permissions)

  const columns: any = [
    {
      title: 'Usuario',
      dataIndex: ['user'],
      key: 'firtsName',
      align: 'center' as AlignType,
      width: 250,
      render: (user: UsersResponse) => (
        <span>{capitalizeWords(user.firstName + ' ' + user.lastName)}</span>
      ),
    },
    {
      title: 'Imágen',
      dataIndex: 'image',
      key: 'image',
      align: 'center' as AlignType,
      width: 60,
      render: (image: string) => (
        <>
          {image ? (
            <div>
              <a data-fancybox="gallery" href={image}>
                <Image src={image} alt="Imagen" width={40} />
              </a>
            </div>
          ) : (
            '-'
          )}
        </>
      ),
    },
    {
      title: 'Mensaje',
      dataIndex: 'content',
      key: 'content',
      align: 'center' as AlignType,
      render: (text: string) => (
        // Create a label clean ui component
        <div
          className="text-sm text-gray-600"
          dangerouslySetInnerHTML={{__html: text}}
        />
      ),
    },
    {
      title: 'Creado',
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center' as AlignType,
      render: (date: string) => (
        <div className="text-sm text-gray-600">
          {formatDateCabos(date).label}
        </div>
      ),
    },

    {
      title: 'Estatus alerta',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as AlignType,
      render: (status: string) => (
        <Badge
          textKey={getAlertStatus(status as AlertStatus)}
          color={colorBadge(status)}
        />
      ),
    },
    {
      title: 'Acciones',
      dataIndex: 'id',
      key: 'id',
      align: 'center' as AlignType,
      render: (id: string) => {
        return (
          <ActionButtons
            id={id}
            editModalView={permission ? 'CHANGE_STATUS_ALERT' : ''}
            deleteModalView={permission ? 'ALERT_DELETE' : ''}
            detailsUrl={Routes.alerts.details({id})}
          />
        )
      },
    },
  ]

  function back() {
    router.back()
  }

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          columns={columns}
          data={alerts ?? []}
          rowKey={'id'}
          scroll={{x: 800}}
        />
      </div>
      {!!paginatorInfo && (
        <div>
          <Pagination
            total={parseInt(paginatorInfo.total.toString())}
            current={parseInt(paginatorInfo.currentPage.toString())}
            pageSize={parseInt(paginatorInfo.perPage.toString())}
            onChange={onPagination}
          />
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={back}>{t('form:form-button-back')}</Button>
      </div>
    </>
  )
}

export default AlertList
