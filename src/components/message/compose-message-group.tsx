import {useState} from 'react'
import {useForm} from 'react-hook-form'
import Image from 'next/image'
import isEmpty from 'lodash/isEmpty'

import {MessageAvatarPlaceholderIcon} from '@/components/icons/message-avatar-placeholder-icon'
import Button from '@/components/ui/button'
import Select from '../select/select'
import {useUsersQuery} from '@/data/users'
import {useCreateConversations} from '@/data/conversations'
import ErrorMessage from '../ui/error-message'
import {jobPosition} from '@/utils/format-date'
import TextArea from '../ui/text-area'
import Label from '../ui/label'
import {useSocketContext} from '@/contexts/socket.context'
import {useModalAction} from '../ui/modal/modal.context'
import {useMeQuery} from '@/data/user'
import {capitalizeWords} from '@/utils/functions'
import {useJobPositionQuery} from '@/data/job-position'

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

const ComposeMessageGroupModal = () => {
  const {handleSubmit} = useForm()
  const [user,setUser] = useState<any>(null)
  // const [jobposition, setJobposition] = useState<any>(null)
  const [content,setcontent] = useState<any>(null)
  const [active,setIsActive] = useState<boolean>(Boolean(0))
  const [page,setPage] = useState(1)
  const [searchJob,setSearchJob] = useState('')

  const {data} = useMeQuery()

  const {createChatGroup} = useSocketContext()
  const {closeModal} = useModalAction()

  const {users,loading,error} = useUsersQuery({
    limit: 100,
    page,
  })

  const {jobposition} = useJobPositionQuery()

  // if (errorSending) return <ErrorMessage message={error?.message} />

  const onTypeFilter = (user: any | undefined) => {
    setUser(user)
    setIsActive(user?.banned)
  }

  // const onTypeFilterJob = (jobPosition: any | undefined) => {
  //   if (jobPosition) {
  //     setJobposition(jobPosition.value)
  //   } else {
  //     setJobposition(null)
  //   }
  // }

  function handleSelect(value: any) {
    if (value) {
      setSearchJob(value.value)
    } else {
      setSearchJob('')
    }
  }

  //@ts-ignore
  const formattedJobposition = jobposition?.map((doc) => ({
    label: capitalizeWords(doc.name),
    value: doc.id,
  }))

  async function onSubmit() {
    const userIds = users
      .filter((user) => user.jobPositionId === Number(searchJob))
      .map((user) => user.id)

    userIds.push(data.id)
    const participants = {participants: userIds}

    createChatGroup(participants)
    closeModal()
  }
  return (
    <div className="m-auto block max-w-lg rounded bg-light p-6 md:w-[32.5rem]">
      <h2 className="mb-6 text-base font-medium">Iniciar conversación</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Select
          getOptionValue={(option: any) => option.value}
          getOptionLabel={(option: any) => option.label}
          options={formattedJobposition ?? []}
          isMulti={false}
          className="w-full"
          isClearable
          onChange={handleSelect}
        />

        <div className="mt-6 text-right">
          <Button className="px-4 text-base ">Enviar</Button>
        </div>
      </form>
    </div>
  )
}

export default ComposeMessageGroupModal
