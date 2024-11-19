import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { formatDate } from '@/utils/format-date'

import TitleWithSort from '@/components/ui/title-with-sort'
import Badge from '@/components/ui/badge/badge'
import { AlignType, Table } from '@/components/ui/table'
import ActionButtons from '@/components/common/action-buttons'
import Pagination from '@/components/ui/pagination'
import Avatar from '@/components/common/avatar'

import { JobPosition, Role, UsersResponse } from '@/types/users'
import { MappedPaginatorInfo, SortOrder } from '@/types/index'
import { Shift } from '@/types/suggestions'
import { jobPositionFormat } from '@/utils/job-position-format'
import { RoundsReponse } from '@/types/rounds'
import { format } from 'date-fns'
import { colorStatusRound } from '@/utils/colorBadge'
import { Routes } from '@/config/routes'
import { capitalizeWords } from '@/utils/functions'
import { switchRoundStatus } from '@/types/typeRoundStatus'

type RoundListProps = {
  rounds: RoundsReponse[]
  paginatorInfo?: MappedPaginatorInfo | null
  onPagination?: (current: number) => void
}

function convertDate(date: string) {
  return new Date(date).toISOString().slice(0, -5)
}

const RoundTable = ({
  rounds,
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
      render: (text: any) => <span>{capitalizeWords(text)}</span>,
    },
    {
      title: t('table:table-item-round-start'),
      dataIndex: 'start',
      key: 'start',
      align: 'center' as AlignType,
      render: (text: any) => <span>{formatDate(text)}</span>,
    },
    {
      title: t('table:table-item-round-end'),
      dataIndex: 'end',
      key: 'end',
      align: 'center' as AlignType,
      render: (text: any) => <span>{formatDate(text)}</span>,
    },
    {
      title: t('table:table-item-round-status'),
      dataIndex: 'status',
      key: 'status',
      align: 'center' as AlignType,
      render: (status: any) => (
        <>
          <Badge
            color={colorStatusRound(status)}
            text={switchRoundStatus(status)}
          />
        </>
      ),
    },

    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'id',
      align: 'center' as AlignType,
      render: (id: string) => {
        return (
          <ActionButtons
            id={id}
            detailsUrl={`${router.asPath}/${id}`}
            showUserRound={`${router.asPath}/${id}/users`}
          />
        )
      },
    },
  ]
  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          columns={columns}
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
    </>
  )
}

export default RoundTable
