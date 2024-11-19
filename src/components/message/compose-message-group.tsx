/* eslint-disable @typescript-eslint/no-explicit-any */
import {useState} from 'react'
import {useForm} from 'react-hook-form'

import Button from '@/components/ui/button'
import Select from '../select/select'
import {useUsersQuery} from '@/data/users'
import {useSocketContext} from '@/contexts/socket.context'
import {useModalAction} from '../ui/modal/modal.context'
import {useMeQuery} from '@/data/user'
import {capitalizeWords} from '@/utils/functions'
import {useJobPositionQuery} from '@/data/job-position'




const ComposeMessageGroupModal = () => {
  const {handleSubmit} = useForm()

  const [searchJob,setSearchJob] = useState('')

  const {data} = useMeQuery()

  const {createChatGroup} = useSocketContext()
  const {closeModal} = useModalAction()

  const {users} = useUsersQuery({
    limit: 100,
    page: 1,
  })

  const {jobposition} = useJobPositionQuery()

  function handleSelect(newValue: unknown) {
    const value = newValue as {value: string} | null;
    if (value) {
      setSearchJob(value.value)
    } else {
      setSearchJob('')
    }
  }

  interface JobPosition {
    id: number;
    name: string;
  }

  interface FormattedJobPosition {
    label: string;
    value: number;
  }

  const formattedJobposition: FormattedJobPosition[] = jobposition?.map((doc: JobPosition) => ({
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
