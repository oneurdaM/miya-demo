import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import router, { useRouter } from 'next/router'

import TitleWithSort from '@/components/ui/title-with-sort'
import Badge from '@/components/ui/badge/badge'
import { AlignType, Table } from '@/components/ui/table'
import ActionButtons from '@/components/common/action-buttons'
import Pagination from '@/components/ui/pagination'
import Avatar from '@/components/common/avatar'

import {
  JobPosition,
  Role,
  switchJobPosition,
  UsersResponse,
} from '@/types/users'
import { MappedPaginatorInfo, SortOrder } from '@/types/index'
import { Shift } from '@/types/suggestions'
import { jobPositionFormat } from '@/utils/job-position-format'
import { RoundsReponse } from '@/types/rounds'
import { format } from 'date-fns'
import { colorStatusRound } from '@/utils/colorBadge'
import { Routes } from '@/config/routes'
import { useRoundQueryId } from '@/data/round'
import { useUsersQuery } from '@/data/users'
import Button from '../ui/button'
import { render } from '@testing-library/react'
import { capitalizeWords } from '@/utils/functions'

type RoundListProps = {
  rounds: RoundsReponse[]
  paginatorInfo?: MappedPaginatorInfo | null
  onPagination?: (current: number) => void
}

function convertDate(date: string) {
  return new Date(date).toISOString().slice(0, -5)
}

const UserRoundTable = ({
  rounds,
  paginatorInfo,
  onPagination,
}: RoundListProps) => {
  const { t } = useTranslation()
  const {
    query: { id },
  } = router

  const { round, loading, error } = useRoundQueryId({
    id: Number(id),
  })

  const columns = [
    {
      title: <span className="px-16 ">Imagén</span>,
      dataIndex: 'image',
      key: 'image',
      align: 'center' as AlignType,
      render: (_data: any, { firstName, image, email }: UsersResponse) => (
        <div className="flex items-center justify-center">
          <Avatar name={firstName} src={image ?? ''} />
          <div className="flex flex-col whitespace-nowrap font-medium ms-2">
            {firstName}
            <span className="text-[13px] font-normal text-gray-500/80">
              {email}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Nombre',
      dataIndex: 'firstName',
      key: 'firstName',
      align: 'center' as AlignType,
      render: (text: any) => <span>{capitalizeWords(text)}</span>,
    },

    {
      title: 'Apellido',
      dataIndex: 'lastName',
      key: 'lastName',
      align: 'center' as AlignType,
      render: (text: any) => <span>{capitalizeWords(text)}</span>,
    },

    {
      title: 'Estado',
      width: 100,
      dataIndex: 'banned',
      key: 'banned',
      align: 'center',
      render: (banned: boolean) => (
        <Badge
          textKey={!banned ? 'common:text-active' : 'common:text-inactive'}
          color={
            !banned
              ? 'bg-accent/10 !text-accent'
              : 'bg-status-failed/10 text-status-failed'
          }
        />
      ),
    },

    {
      title: <span className="px-3 ">Perfil</span>,
      dataIndex: 'jobPosition',
      key: 'jobPosition',
      align: 'center' as AlignType,
      render: (text: any) => <span>{text?.name}</span>,
    },

    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      width: 250,
      key: 'id',
      align: 'center' as AlignType,
      render: (id: string, user: UsersResponse) => {
        const { banned, role } = user // Extraer las propiedades de user si necesitas utilizarlas
        return (
          <ActionButtons
            id={id}
            showCheckpoints={'SHOW_CHECKPOINT'}
            // showRounds={`../../users/rounds/${id}`}
          />
        )
      },
    },
  ]

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}
          //@ts-ignore
          data={rounds}
          rowKey={'id'}
          scroll={{ x: 1000 }}
        />
      </div>
      {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            //@ts-ignore
            total={parseInt(paginatorInfo.total)}
            //@ts-ignore
            current={parseInt(paginatorInfo.currentPage)}
            //@ts-ignore
            pageSize={parseInt(paginatorInfo.perPage)}
            onChange={onPagination}
          />
        </div>
      )}

      <div className="w-full text-end">
        <Button
          type="button"
          onClick={() => router.back()}
          className="bg-zinc-600 mx-3"
        >
          {t('form:form-button-back')}
        </Button>
      </div>
    </>
  )
}

export default UserRoundTable
