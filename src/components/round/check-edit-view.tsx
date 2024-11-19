import { useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'

import { siteSettings } from '@/settings/site.settings'
import TextArea from '../ui/text-area'
import Button from '../ui/button'
import { useTranslation } from 'react-i18next'
import { useModalState } from '../ui/modal/modal.context'
import { useAlertEditMutation, useAlertQuery } from '@/data/alert'
import Label from '../ui/label'
import Select from '../ui/select/select'
import { AlertStatus, AlertStatusArray } from '@/types/alerts'
import Loader from '../ui/loader/loader'
import { useMeQuery } from '@/data/user'
import { getAlertStatus } from '@/utils/alert-status'
import { MapPin } from '../icons/map-pin'
import { useCheckpointByIQuery, useRoundQueryId } from '@/data/round'
import Input from '../ui/input'
import Avatar from '../common/avatar'
import StickerCard from '../widgets/sticker-card'
import { ChecklistIcon } from '../icons/summary/checklist'
import Card from '../common/card'
import Table from 'rc-table'
import { AlignType } from 'rc-table/lib/interface'
import { UsersResponse } from '@/types/users'
import { useUsersQuery } from '@/data/users'
import TitleWithSort from '../ui/title-with-sort'
import Badge from '../ui/badge/badge'
import LinkButton from '../ui/link-button'

const CheckChangeStatus = () => {
  const { t } = useTranslation()
  const { data } = useModalState()
  // const {closeModal} = useModalAction();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({})

  const { round, loading, error } = useRoundQueryId({
    id: Number(data),
  })

  const { users } = useUsersQuery({
    limit: 100,
    page: 1,
    search: '',
    jobPosition: '',
  })
  //@ts-ignore

  let idsObjeto2 = round?.user_roundParticipants?.map((item) => item.id)

  // Filtrar objeto1.datos basado en los IDs de objeto2
  //@ts-ignore
  let nuevoArreglo = users?.filter((item) => !idsObjeto2?.includes(item.id))

  const onSubmit = (data: any) => {}
  const columns = [
    {
      title: <span className="px-16 ">Imagén</span>,
      dataIndex: 'image',
      key: 'image',
      align: 'center' as AlignType,
      render: (_data: any, { firstName, image, email }: UsersResponse) => (
        <div className="flex items-center">
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
    },

    {
      title: 'Apellido',
      dataIndex: 'lastName',
      key: 'lastName',
      align: 'center' as AlignType,
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
    },
  ]

  return (
    <div className="m-auto rounded w-full bg-light border-2 p-7 overflow-hidden">
      <div className="flex justify-between">
        <h2 className="text-gray-500 text-lg">Usuarios en esta Ronda</h2>
        <LinkButton href={''}>Agregar usuario</LinkButton>
      </div>

      <Card className="mb-8 flex w-full items-center md:flex-row">
        <div className="flex justify-center w-full">
          <Table
            //@ts-ignore
            columns={columns}
            data={users}
            className="w-full h-1/2"
            emptyText={<div className="text-center">No hay datos</div>}
            rowKey={'id'}
          />
        </div>
      </Card>
    </div>
  )
}

export default CheckChangeStatus
