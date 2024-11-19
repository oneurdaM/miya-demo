import { AlignType } from 'rc-table/lib/interface'
import { Table } from '../ui/table'
import ActionButtons from './action-buttons'
import { Routes } from '@/config/routes'

type Chat = {
  messages: any[]
  title: string
}
const ChatTable = ({ messages, title }: Chat) => {
  const columns: any = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center' as AlignType,
    },
    {
      title: 'Mensaje',
      dataIndex: 'content',
      key: 'content',
      align: 'center' as AlignType,
    },
    {
      title: 'Acciones',
      dataIndex: 'conversationId',
      key: 'conversationId',
      align: 'center' as AlignType,
      render: (conversationId: number) => (
        <>
          <ActionButtons
            id={conversationId?.toString()}
            detailsUrl={Routes.conversations.details({
              id: conversationId?.toString(),
            })}
          />
        </>
      ),
    },
  ]

  return (
    <>
      <div className="overflow-hidden rounded shadow">
        <h3 className="border-b border-border-200 bg-light px-4 py-3 text-center font-semibold text-heading">
          {title}
        </h3>
        <Table
          columns={columns}
          data={messages ?? []}
          rowKey="id"
          scroll={{ x: 200 }}
        />
      </div>
    </>
  )
}

export default ChatTable
