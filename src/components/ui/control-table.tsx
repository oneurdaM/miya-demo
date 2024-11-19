import { AlignType } from 'rc-table/lib/interface'
import { Table } from '../ui/table'
import ActionButtons from './action-buttons'
import { Routes } from '@/config/routes'
import Badge from '../ui/badge/badge'
import { colorBadgeDocument } from '@/utils/colorBadge'
import { useRouter } from 'next/router'
import { JobPosition, MappedPaginatorInfo } from '@/types/index'
import Pagination from '@/components/ui/pagination'
import { dropdownIndicatorCSS } from 'react-select/dist/declarations/src/components/indicators'
import { NoDataFound } from '../icons/no-data-found'
import { formatDate } from '@/utils/format-date'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { useState } from 'react'
import { useModalAction } from '@/components/ui/modal/modal.context'
import { Modal } from 'rizzui'
import { useTranslation } from 'react-i18next'
import { jobPositionFormat } from '@/utils/job-position-format'
import { User } from '@/types/suggestions'
import { capitalizeWords } from '@/utils/functions'

type Documents = {
  documentos: any
  title: string
  paginatorInfo?: MappedPaginatorInfo | null
  onPagination?: (current: number) => void
}

function shift(shiftId: any) {
  let string
  switch (shiftId) {
    case 1:
      string = 'Matutino'
      break
    case 2:
      string = 'Vespertino'
      break
    case 3:
      string = 'Nocturno'
      break

    default:
      break
  }
  return string
}

const ControlTable = ({
  documentos,
  title,
  paginatorInfo,
  onPagination,
}: Documents) => {
  const router = useRouter()
  const { t } = useTranslation()

  const columns: any = [
    {
      title: 'Ubicacion',
      dataIndex: ['user', 'sector', 'name'],
      key: 'name',
      align: 'center' as AlignType,
      render: (text: any) => <span>{capitalizeWords(text)}</span>,
    },

    {
      title: 'Nombre',
      dataIndex: 'user',
      key: 'username',
      align: 'center' as AlignType,
      render: (user: User) => (
        <span>{capitalizeWords(user.firstName + ' ' + user.lastName)}</span>
      ),
    },

    // {
    //   title: 'Perfil',
    //   dataIndex: ['user', 'jobPosition'],
    //   key: 'jobPosition',
    //   align: 'center' as AlignType,
    // },

    {
      title: t('table:table-item-job-position'),
      dataIndex: 'jobPosition',
      key: 'jobPosition',
      align: 'center' as AlignType,
      render: (jobPosition: JobPosition) => (
        <span>{t(`table:${jobPositionFormat(jobPosition)}`)}</span>
      ),
    },
    {
      title: 'Turno',
      dataIndex: ['shift', 'name'],
      key: 'jobPosition',
      align: 'center' as AlignType,
      render(text: any) {
        return <>{text}</>
      },
    },
    {
      title: 'En linea',
      dataIndex: ['user', 'online'],
      key: 'online',
      align: 'center' as AlignType,
      render(record: any) {
        return (
          <div className="justify-center flex">
            {record === true ? (
              <div className="bg-green-500 py-1 px-3 rounded-full text-white">
                Activo
              </div>
            ) : (
              <div className="bg-red-500 py-1 px-3 rounded-full text-white">
                In activo
              </div>
            )}
          </div>
        )
      },
    },

    {
      title: 'Acciones',
      dataIndex: 'userId', //id Document
      key: 'userId',
      align: 'center' as AlignType,
      render: (userId: any) => (
        <ActionButtons id={userId} detailsUrl={`users/${userId}`} />
      ),
    },
    // {
    //   title: 'Requeridos',
    //   dataIndex: ['sectorStats', 'totalUsers'],
    //   key: 'name',
    //   align: 'center' as AlignType,
    // },
    // {
    //   title: 'Presentes',
    //   dataIndex: ['sectorStats', 'onSiteUsers'],
    //   key: 'name',
    //   align: 'center' as AlignType,
    // },
    // {
    //   title: 'Faltantes',
    //   dataIndex: ['sectorStats', 'offSiteUsers'],
    //   key: 'name',
    //   align: 'center' as AlignType,
    // },
  ]

  const expandedRowRender = (record: any) => {
    const userColumns: any = [
      {
        title: 'Nombre',
        dataIndex: 'username',
        key: 'username',
        align: 'center' as AlignType,
      },
      {
        title: 'Perfil',
        dataIndex: 'jobPosition',
        key: 'jobPosition',
        align: 'center' as AlignType,
      },
      {
        title: 'En linea',
        dataIndex: 'online',
        key: 'online',
        align: 'center' as AlignType,
        render(record: any) {
          return (
            <div className="justify-center flex">
              {record === true ? (
                <div className="bg-green-500 py-1 px-3 rounded-full text-white">
                  Activo
                </div>
              ) : (
                <div className="bg-red-500 py-1 px-3 rounded-full text-white">
                  In activo
                </div>
              )}
            </div>
          )
        },
      },

      {
        title: 'Acciones',
        dataIndex: 'userId', //id Document
        key: 'userId',
        align: 'center' as AlignType,
        render: (userId: any) => (
          <ActionButtons id={userId} detailsUrl={`users/${userId}`} />
        ),
      },
    ]

    return <Table columns={userColumns} data={record.user} rowKey="id" />
  }

  const rowExpandable = (record: any) => record.user?.length

  function handleCloseModal() {
    setIsModalOpen(false) // Cierra el modal cuando se cierra el modal
  }

  const [isModalOpen, setIsModalOpen] = useState(false)

  // Función para abrir el modal
  const openModal = () => {
    setIsModalOpen(true)
  }

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false)
  }

  function CustomExpandIcon(props: any) {
    let text = '+'
    return (
      <a
        className="border-2 px-2 py-1 rounded-md text-lg hover:border-gray-500 transition-all "
        onClick={(e) => {
          props.onExpand(props.record, e)
        }}
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: text }}
        style={{ color: '#aaa', cursor: 'pointer' }}
      />
    )
  }
  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
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
          // expandable={{
          //   rowExpandable: rowExpandable,
          //   expandedRowRender: () => '',
          //   onExpand: openModal, // Llama a handleEditModal cuando se expande una fila
          //   expandIcon: CustomExpandIcon,
          // }}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-gray-900 bg-opacity-50"
      >
        <div className="bg-white p-8 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Título del Modal</h2>
          <p className="text-base">Contenido del modal...</p>
          <button
            onClick={closeModal}
            className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cerrar Modal
          </button>
        </div>
      </Modal>
    </>
  )
}

export default ControlTable
