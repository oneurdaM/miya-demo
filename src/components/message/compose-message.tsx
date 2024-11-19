import {useState} from 'react'
import {useForm} from 'react-hook-form'
import Image from 'next/image'
import isEmpty from 'lodash/isEmpty'
import {MessageAvatarPlaceholderIcon} from '@/components/icons/message-avatar-placeholder-icon'
import Button from '@/components/ui/button'
import Select from '../select/select'
import {useUsersQuery} from '@/data/users'
import {useSocketContext} from '@/contexts/socket.context'
import {useModalAction} from '../ui/modal/modal.context'
import {useRouter} from 'next/router'

type FormatOptionLabelProps = {
  firstName: string
  lastName: string
  image: string
}

const formatOptionLabel = ({
  image,
  firstName,
  lastName,
}: FormatOptionLabelProps) => (
  <div className="flex items-center">
    <div className="relative mr-3 h-6 w-6 shrink-0 overflow-hidden rounded-full">
      {!isEmpty(image) ? (
        <Image
          src={image}
          alt={firstName}
          className="product-image object-contain"
          fill
          sizes="(max-width: 768px) 100vw"
        />
      ) : (
        <MessageAvatarPlaceholderIcon
          className="text-[1.5rem]"
          color="#DDDDDD"
        />
      )}
    </div>
    <div className="truncate">
      {firstName} {lastName}
    </div>
  </div>
)

const ComposeMessageModal = () => {
  const {createChat} = useSocketContext()
  const {closeModal} = useModalAction()

  const {handleSubmit} = useForm()
  const [user,setUser] = useState<any>(null)
  const [active,setIsActive] = useState<boolean>(Boolean(0))
  const [page,setPage] = useState(1)

  const {users,loading,error} = useUsersQuery({
    limit: 100,
    page,
  })

  const router = useRouter()

  const onTypeFilter = (user: any | undefined) => {
    setUser(user)
    setIsActive(user?.banned)
  }

  async function onSubmit() {
    const data = {
      participant: user?.id,
    }
    createChat(data)
    closeModal()
  }

  return (
    <div className="m-auto block max-w-lg rounded bg-light p-6 md:w-[32.5rem]">
      <h2 className="mb-6 text-base font-medium">Iniciar conversación</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Select
          options={users}
          isLoading={loading}
          getOptionLabel={(option: any) => option?.firstName ?? ''}
          getOptionValue={(option: any) => option?.id ?? ''}
          placeholder="Encuentra a un usuario"
          onChange={onTypeFilter as any}
          isClearable={true}
          // @ts-ignore
          formatOptionLabel={formatOptionLabel}
        />
        <div className="mt-6 text-right">
          <Button
            className="px-4 text-base "
            disabled={!user || Boolean(active)}
          >
            Enviar
          </Button>
        </div>
      </form>
    </div>
  )
}

export default ComposeMessageModal
