/* eslint-disable @typescript-eslint/no-explicit-any  */
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Controller, useForm } from 'react-hook-form'

import { useUsersQuery } from '@/data/users'
import { useShiftQuery } from '@/data/shift'

import Card from '@/components/common/card'
import Description from '@/components/ui/description'
import FileInput from '@/components/ui/file-input'
import Input from '@/components/ui/input'
import Button from '@/components/ui/button'
import Label from '@/components/ui/label'
import SelectInput from '@/components/ui/select-input'

import { JobPosition, UsersResponse } from '@/types/users'
import { DatePicker } from '../ui/date-picker'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  roundRegisterMutation,
  useCheckpointByIdRoudQuery,
  useCheckpointDeleteMutation,
  useUpdateRoundMutation,
} from '@/data/round'

import { AlignType } from 'rc-table/lib/interface'
import { Router, useRouter } from 'next/router'
import { RoundsReponse } from '@/types/rounds'
import { MinusIcon } from '../icons/minus-icon'
import { PlusIcon } from '../icons/plus-icon'
import { nanoid } from 'nanoid'
import CheckpointList from './table-checkpoint'
import PageHeading from '../common/page-heading'
import LinkButton from '../ui/link-button'

type FormValue = {
  id: number
  name: string
  start: string
  end: string
  statusObjec: string
  users: Array<any>
  checkpoint: [
    {
      location: string
      longitude: string
      latitude: string
      time: string
    },
  ]
}

type IProps = {
  initialValues?: RoundsReponse
}
const checkpointSchema = yup.object().shape({
  location: yup.string().required('La ubicación del checkpoint es requerida'),
  longitude: yup.string().required('La longitud del checkpoint es requerida'),
  latitude: yup.string().required('La latitud del checkpoint es requerida'),
})

const schema = yup.object().shape({
  name: yup.string().required('El nombre es requerido'),
  start: yup.date().required('La fecha de inicio es requerida'),
  end: yup.date().required('La fecha de fin es requerida'),
  statusObjec: yup.object().required('El estado es requerido'),
  checkpoint: yup.array().of(checkpointSchema),
  users: yup.array().min(1, 'Debes seleccionar al menos un usuario'),
})

const statusOptions = [
  { label: 'IN_PROGRESS', value: 'En progreso' },
  { label: 'COMPLETED', value: 'Completada' },
  { label: 'VERIFIED', value: 'Verificada' },
  { label: 'ACTIVE', value: 'Activa' },
]

export default function EditRound({ initialValues }: IProps) {
  const { t } = useTranslation()

  const router = useRouter()
  const {
    query: { id },
  } = router

  const [endDate, setEndDate] = useState<Date>()

  const { mutate: update, isLoading: loading } = useUpdateRoundMutation()

  const { shifts, loading: loadingShifts } = useShiftQuery({
    limit: 20,
    page: 1,
  })

  const [show, setShow] = useState(false)

  const [searchTerm, setSearchTerm] = useState('')
  const [searchJob, setSearchJob] = useState('')
  const [page, setPage] = useState(1)

  const { users } = useUsersQuery({
    limit: 100,
    page,
    search: searchTerm,
    jobPosition: searchJob,
  })

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    trigger,
    resetField,
    formState: { errors },
  } = useForm<any>({
    defaultValues: initialValues,
  })

  async function onSubmit(values: any) {
    delete values.checkpoint
    delete values.timestamp
    delete values.user_roundParticipants
    values.status = values.statusObjec.label
    delete values.statusObjec
    update({ id: values.id, ...values })
  }
  const targetRef = useRef(null)

  const [selectedDateEnd, setSelectedDateEnd] = useState(
    initialValues?.end ? new Date(initialValues?.end) : null
  )
  const [selectedDatestart, setSelectedDatestart] = useState(
    initialValues?.start ? new Date(initialValues?.start) : null
  )

  const handleChange = (date: any, field: any) => {
    if (field === 'start') {
      setSelectedDatestart(date)
      setValue('start', date)
    } else {
      setSelectedDateEnd(date)
      setValue('end', date)
    }
  }
  const { checkpoint } = useCheckpointByIdRoudQuery({
    id: Number(id),
  })

  const handleScroll = () => {
    if (targetRef.current) {
      //@ts-ignore
      targetRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  function routeCheckpoint() {
    router.push('../checkpoint/' + id)
  }

  // const { mutate } = useCheckpointDeleteMutation()

  // const handleAddInput = () => {
  //   const newCheckpoint = {
  //     //@ts-ignore
  //     id: 'aux - ' + checkpoints?.length + 1,
  //     location: '',
  //     longitude: '',
  //     latitude: '',
  //     time: '',
  //   }

  //   //@ts-ignore
  //   setCheckpoints([...checkpoints, newCheckpoint])
  // }

  // function handleRemoveInput(id: any) {
  //   if (typeof id !== 'number' && id.split('-')[0] === 'aux') {
  //     const checkpoint = checkpoints?.filter((item) => item.id !== id)

  //     //@ts-ignore
  //     setCheckpoints(checkpoint)
  //   } else {
  //     const index = indexToCleanField(id)

  //     setValue(`checkpoint[${index}].name`, '')
  //     setValue(`checkpoint[${index}].location`, '')
  //     setValue(`checkpoint[${index}].latitude`, '')
  //     setValue(`checkpoint[${index}].longitude`, '')
  //     setValue(`checkpoint[${index}].time`, '')
  //     //@ts-ignore

  //     const checkpoint = checkpoints?.filter((item) => item.id !== id)

  //     console.log(id)

  //     console.log(checkpoint)

  //     //@ts-ignore
  //     setCheckpoints(checkpoint)
  //   }
  // }

  // function indexToCleanField(id: any) {
  //   let indexToClean = 0
  //   checkpoints?.filter((item, index) => {
  //     if (item.id === id) {
  //       indexToClean = index
  //     }
  //   })

  //   return indexToClean
  // }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
          <Description
            title="Nombre"
            details={t('form:form-update-user-description') as string}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="mb-5 w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t('form:form-name-round') as string}
              {...register('name')}
              variant="outline"
              placeholder="Escriba el nombre"
              className=""
            />
            {errors.name && (
              <span className="text-sm text-red-700">
                {errors.name.message + '*'}
              </span>
            )}

            <Label className="mb-4 mt-5">{t('form:form-start')}</Label>
            <Controller
              control={control}
              name="start"
              render={({ field: { onChange, onBlur, value } }) => (
                <DatePicker
                  showTimeSelect
                  placeholderText="Selecciona una fecha"
                  isClearable={true}
                  dateFormat="dd/MM/yyyy h:mm aa"
                  onChange={(date) => {
                    handleChange(date, 'start')
                  }}
                  onBlur={onBlur}
                  timeFormat="HH:mm:ss"
                  selected={selectedDatestart}
                  selectsEnd
                  timeIntervals={10}
                  className="flex h-12 w-full appearance-none items-center rounded-md px-4 text-sm text-heading transition duration-300 ease-in-out focus:border-accent focus:outline-none"
                />
              )}
            />

            {errors.start && (
              <span className="text-sm text-red-700">
                {errors.start.message + '*'}
              </span>
            )}

            <Label className="mb-4 mt-5">{t('form:form-end')}</Label>
            <Controller
              control={control}
              name="end"
              render={({ field: { onChange, onBlur, value } }) => (
                <DatePicker
                  showTimeSelect
                  placeholderText="Selecciona una fecha"
                  isClearable={true}
                  dateFormat="dd/MM/yyyy h:mm aa"
                  onChange={(date) => {
                    handleChange(date, 'end')
                  }}
                  onBlur={onBlur}
                  timeFormat="HH:mm:ss"
                  selected={selectedDateEnd}
                  selectsEnd
                  timeIntervals={10}
                  className="flex h-12 w-full appearance-none items-center rounded-md px-4 text-sm text-heading transition duration-300 ease-in-out focus:border-accent focus:outline-none"
                />
              )}
            />

            {errors.end && (
              <span className="text-sm text-red-700">
                {errors.end.message + '*'}
              </span>
            )}

            <Label className="mb-4 mt-5">{t('form:form-status')}</Label>
            <SelectInput
              placeholder="Seleccione el estatus"
              control={control}
              name={'statusObjec'}
              options={statusOptions}
              defaultValue={{
                label: initialValues?.status,
                value: initialValues?.status,
              }}
            ></SelectInput>
            <div className="border-b-2 border-dashed my-5"></div>

            <div className="w-full text-end">
              <Button
                type="button"
                onClick={handleScroll}
                className="mx-3 bg-slate-500"
              >
                {show ? 'Ocultar checkpoints' : 'Ver checkpoints'}
              </Button>

              <Button className="mx-3">{t('form:form-update')}</Button>
            </div>
          </Card>
        </div>
      </form>

      {/* {show ? (
        <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
          <div className="mb-5 w-full sm:w-8/12 md:w-full">
            <div className="flex w-full justify-between items-center md:flex-row ">
              <div className="mb-4 md:mb-0 md:w-1/4">
                <PageHeading title="Checkpoints de esta ronda" />
              </div>

              <Button>
                <span>+ Agregar Checkpoint</span>
              </Button>
            </div>
            {/* <>
              <h3 className="mb-3 text-xl">CheckPoint</h3>

              {checkpoints?.map((input, index) => (
                <div key={input.id} className="w-full mr-4">
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <Input
                        label={t('form:form-name') as string}
                        {...register(`checkpoint[${index}].name`)}
                        variant="outline"
                        className=""
                        placeholder="Escriba el nombre"
                      />
                    </div>

                    <div>
                      <Input
                        label={t('form:form-location') as string}
                        {...register(`checkpoint[${index}].location`)}
                        variant="outline"
                        placeholder="Escriba la ubicación"
                        className=""
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 mb-3 gap-2 items-center h-30">
                    <div className="col-span-4 h-10 mb-20">
                      <Input
                        label={t('form:form-latitude') as string}
                        {
                          //@ts-ignore
                          ...register(`checkpoint[${index}].latitude`)
                        } // Aquí usamos una notación de cadena para registrar campos dinámicos
                        type="number"
                        step="0.01" // Esto permite valores con dos decimales
                        variant="outline"
                        className=""
                        placeholder="Escriba la latitud"
                      />
                    </div>

                    <div className="col-span-3  h-10 mb-20">
                      <Input
                        type="number"
                        placeholder="Escriba la longitud"
                        step="0.01" // Esto permite valores con dos decimales
                        label={t('form:form-longitude') as string}
                        {
                          //@ts-ignore
                          ...register(`checkpoint[${index}].longitude`)
                        } // Aquí usamos una notación de cadena para registrar campos dinámicos
                        variant="outline"
                        className=""
                      />
                    </div>

                    <div className="col-span-3  h-10 mb-20">
                      <Input
                        type="number"
                        placeholder={t('form:form-estimate') as string}
                        label={
                          (t('form:form-estimate') as string) + ' en minutos'
                        }
                        {...register(`checkpoint[${index}].time`)}
                        onChange={(e) => {
                          handleTest(id, e.target.value)
                        }}
                        variant="outline"
                        className=""
                      />
                    </div>

                    <div className="col-span-2 gap-2 flex justify-center">
                      <button
                        disabled={index <= 0 ? true : false}
                        type="button"
                        className={`rounded-full border border-black hover:border-blue-400 ${
                          index <= 0
                            ? 'cursor-not-allowed hover:border-gray-400 '
                            : ''
                        }`}
                        onClick={() => handleRemoveInput(input.id)}
                      >
                        <MinusIcon
                          className={`${
                            index <= 0
                              ? 'hover:text-gray-400 '
                              : 'hover:text-blue-400 '
                          }`}
                          width={20}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </> */}
      {/* <br />*/}

      <div ref={targetRef}>
        <Card className="mb-8 flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <PageHeading title={'Checkpont de esta ronda'} />
          </div>

          <LinkButton href={'../checkpoint/create?id=' + id}>
            <span>+ Agregar Checkpoint</span>
          </LinkButton>
        </Card>
        <CheckpointList checkpoint={checkpoint} />
      </div>
      {/* </div> */}
      {/* </div> */}
      {/* ) : null} */}
    </>
  )
}
