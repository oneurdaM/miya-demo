import { AlignType, Table } from '@/components/ui/table'
import { Routes } from '@/config/routes'
import { useUpdateNoteMutation } from '@/data/blog'
import { Note } from '@/types/blog'
import { MappedPaginatorInfo } from '@/types/index'
import { Switch } from '@headlessui/react'
import Image from 'next/image'
import Pagination from '../ui/pagination'
import TitleWithSort from '../ui/title-with-sort'
import ActionButtons from '../common/action-buttons'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { getAuthCredentials, hasAccess, adminOnly } from '@/utils/auth-utils'

type NotesListProps = {
  notes: Note[] | null | undefined
  paginatorInfo: MappedPaginatorInfo | null
  onPagination: (page: number) => void
}

const NotesList = ({ notes, paginatorInfo, onPagination }: NotesListProps) => {
  const { t } = useTranslation()
  const { mutate: update, isLoading } = useUpdateNoteMutation()
  function changeStatus(note: Note, status: boolean) {
    update({
      id: note.id.toString(),
      is_approved: !status,
    })
  }

  const { permissions } = getAuthCredentials()
  let permission = hasAccess(adminOnly, permissions)

  const columns: any = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center' as AlignType,
      width: 64,
    },
    {
      title: 'Imágen',
      dataIndex: 'image',
      key: 'image',
      align: 'center' as AlignType,
      width: 74,
      render: (image: string) => (
        <Image
          src={image ?? '/images/placeholder.png'}
          alt="artile"
          className="overflow-hidden rounded"
          width={42}
          height={42}
        />
      ),
    },
    {
      title: <TitleWithSort title="Título" ascending={true} isActive={false} />,
      dataIndex: 'title',
      key: 'title',
      align: 'center' as AlignType,
      width: 170,
    },
    {
      title: 'Contenido',
      dataIndex: 'content',
      key: 'content',
      align: 'center' as AlignType,
    },
    {
      title: 'Aprobado',
      dataIndex: 'is_approved',
      key: 'is_approved',
      align: 'center' as AlignType,

      render: function Render(is_approved: boolean, record: any) {
        const [approved, setAproved] = useState(is_approved)

        const handleSwitchChange = (checked: boolean) => {
          setAproved(checked)

          changeStatus(record, approved)
        }
        return (
          <Switch
            checked={approved}
            onChange={handleSwitchChange}
            disabled={!permission ? true : false}
            className={`${
              approved ? 'bg-accent' : 'bg-gray-300'
            } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
          >
            <span
              className={`${
                approved ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-light`}
            />
          </Switch>
        )
      },
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: 'center',
      render: function Render(id: string, note: Note) {
        return (
          <>
            <ActionButtons
              id={id}
              deleteModalView={permission ? 'DELETE_NOTE' : ''}
              detailsUrl={
                permission ? Routes.blog.details({ id: note.slug }) : ''
              }
            />
          </>
        )
      },
    },
  ]

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          rowKey="id"
          scroll={{ x: 900 }}
          columns={columns}
          emptyText="No hay notas creadas"
          data={notes ?? []}
        />
      </div>

      {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginatorInfo.total}
            current={
              //@ts-ignore
              parseInt(paginatorInfo.currentPage)
            }
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  )
}

export default NotesList
