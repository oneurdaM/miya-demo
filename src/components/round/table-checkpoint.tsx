import Image from 'next/image'
import { Table } from '../ui/table'
import Pagination from '../ui/pagination'

import { Alert } from '@/types/alerts'
import { MappedPaginatorInfo, SortOrder } from '@/types/index'
import { siteSettings } from '@/settings/site.settings'
import ActionButtons from '../ui/action-buttons'
import { AlignType } from 'rc-table/lib/interface'
import { formatDate } from '@/utils/format-date'
import { Routes } from '@/config/routes'
import TitleWithSort from '../ui/title-with-sort'
import { useState } from 'react'
import { StarIcon } from '../icons/star-icon'
import Button from '../ui/button'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

type CheckpointListProps = {
  checkpoint: any
}

const CheckpointList = ({ checkpoint }: CheckpointListProps) => {
  const { t } = useTranslation()
  const router = useRouter()

  const columns: any = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center' as AlignType,
    },
    {
      title: 'Ubicación',
      dataIndex: 'location',
      key: 'location',
      align: 'center' as AlignType,
    },
    {
      title: 'Latitud',
      dataIndex: 'latitude',
      key: 'location',
      align: 'center' as AlignType,
    },
    {
      title: 'Longuitud',
      dataIndex: 'longitude',
      key: 'location',
      align: 'center' as AlignType,
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
            editUrl={'/checkpoint/edit/' + id}
            deleteModalView={'CHECKPOINT_DELETE'}
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
          data={checkpoint ?? []}
          rowKey={'id'}
          scroll={{ x: 800 }}
        />
      </div>

      <Button
        type="button"
        onClick={() => router.push('../round')}
        className="bg-zinc-600 mx-3"
      >
        {t('form:form-button-back')}
      </Button>

      {/* <div className="flex justify-end">
        <Button onClick={back}>{t('form:form-button-back')}</Button>
      </div> */}
    </>
  )
}

export default CheckpointList
