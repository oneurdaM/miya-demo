/* eslint-disable @typescript-eslint/no-explicit-any */
import React,{useEffect,useState} from 'react'
import {useTranslation} from 'react-i18next'

import {Controller,useForm} from 'react-hook-form'

import {useUsersQuery} from '@/data/users'
import Card from '@/components/common/card'
import Description from '@/components/ui/description'
import Button from '@/components/ui/button'

import {useRouter} from 'next/router'
import Select from '../select/select'

import {useAddUserToRound} from '@/data/round'
import {UsersResponse} from '@/types/users'

type IProps = {
  initialValues?: any
}

export default function AddUserToRound({initialValues}: IProps) {
  const {t} = useTranslation()

  const router = useRouter()
  const [selectedUsers,setSelectedUsers] = useState([])

  const [page,setPage] = useState(1)
  const [userExistInRound,setUserExistInRound] = useState<UsersResponse[]>([])

  const {
    query: {id},
  } = router

  const {users,loading,paginatorInfo} = useUsersQuery({
    limit: 10,
    page,
    search: '',
    jobPosition: '',
  })

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 && // Un pequeño margen
        !loading &&
        false
      ) {
      }
    }

    window.addEventListener('scroll',handleScroll)
    return () => window.removeEventListener('scroll',handleScroll)
  },[loading])

  const {
    handleSubmit,
    control,
  } = useForm<any>({})
  const {mutate: create} = useAddUserToRound()

  async function onSubmit() {
    const data = {
      roundId: Number(id),
      userIds: selectedUsers.map((e: any) => e.value),
    }
    create(data)
  }

  useEffect(() => {
    if (users) {
      const newUsers = users.filter(
        (user) =>
          !initialValues?.user_roundParticipants.some(
            (userB: any) => user.id === userB.id
          )
      )
      setUserExistInRound((prev) => [...prev,...newUsers])
    }
  },[users,initialValues?.user_roundParticipants])

  const handleSelectChange = (selectedOptions: any) => {
    setSelectedUsers(selectedOptions)
  }

  const loadMore = () => {
    if (paginatorInfo && page < paginatorInfo?.totalPages) {
      setPage((prev) => prev + 1)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
          <Description
            title="Añadir usuarios"
            details="Añade usuarios a esta ronda para poder vizualizarlos en la ronda"
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          <Card className="mb-5 w-full sm:w-8/12 md:w-2/3 flex justify-center">
            <div className="p-0 w-full sm:ps-2 ">
              <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  control={control}
                  name="users"
                  render={({field: {onChange,onBlur,value}}) => (
                    <Select
                      options={userExistInRound?.map((user) => ({
                        value: user.id,
                        label:
                          user.firstName +
                          ' ' +
                          user.lastName +
                          ' - ' +
                          user.jobPosition?.name,
                        image: user.image,
                        jobPosition: user.jobPosition,
                        lastName: user.lastName,
                        online: user.online,
                      }))}
                      required
                      placeholder={'Seleccione una opción'}
                      value={value}
                      onBlur={onBlur}
                      isMulti
                      onChange={(selectedOptions) => {
                        onChange(selectedOptions)
                        handleSelectChange(selectedOptions)
                      }}
                      onMenuScrollToBottom={loadMore} // Cargar más usuarios al hacer scroll
                    />
                  )}
                />
              </form>
            </div>
          </Card>
          <div className="w-full text-end">
            <Button disabled={selectedUsers.length > 0 ? false : true}>
              Añadir usuarios
            </Button>

            <Button
              type="button"
              onClick={() => router.back()}
              className="bg-zinc-600 mx-3"
            >
              {t('form:form-button-back')}
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}
