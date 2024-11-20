/* eslint-disable @typescript-eslint/no-explicit-any */
import Avatar from '../common/avatar'

import Card from '../common/card'
import Table from 'rc-table'
import {AlignType} from 'rc-table/lib/interface'
import {UsersResponse} from '@/types/users'
import {useUsersQuery} from '@/data/users'
import Badge from '../ui/badge/badge'
import LinkButton from '../ui/link-button'

const CheckChangeStatus = () => {

  const {users} = useUsersQuery({
    limit: 100,
    page: 1,
    search: '',
    jobPosition: '',
  })

  const columns: any = [
    {
      title: <span className="px-16 ">Imagén</span>,
      dataIndex: 'image',
      key: 'image',
      align: 'center' as AlignType,
      render: (_data: unknown,{firstName,image,email}: UsersResponse) => (
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
