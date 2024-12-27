/* eslint-disable @typescript-eslint/no-explicit-any  */
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Controller, useForm } from 'react-hook-form'
import Card from '@/components/common/card'
import Description from '@/components/ui/description'
import Input from '@/components/ui/input'
import Button from '@/components/ui/button'
import Label from '@/components/ui/label'
import SelectInput from '@/components/ui/select-input'
import { DatePicker } from '../ui/date-picker'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { roundRegisterMutation } from '@/data/round'
import { AlignType } from 'rc-table/lib/interface'
import Avatar from '../common/avatar'
import { MinusIcon } from '../icons/minus-icon'
import { PlusIcon } from '../icons/plus-icon'
import {  useRouter } from 'next/router'
import { RoundsReponse } from '@/types/rounds'
import { daysWeek, statusOptions } from '@/types/select'
import { UsersResponse } from '@/types/users'

type FormValue = {
  id: number
  name: string
  start: string
  end: string
  statusObjec: string
  users: Array<any>
  time: string
  profiles: Array<any>
  dayObjec: string
}

type IProps = {
  initialValues?: RoundsReponse
  users?: any
}
const checkpointSchema = yup.object().shape({
  name: yup.string().required('El nombre del checkpoint es requerido'),
  location: yup.string().required('La ubicación del checkpoint es requerida'),
  longitude: yup.string().required('La longitud del checkpoint es requerida'),
  latitude: yup.string().required('La latitud del checkpoint es requerida'),
  time: yup.string().required('El tiempo es requerido'),
})

const userSchema = yup.object().shape({
  value: yup.number().required('El ID es requerido'),
  label: yup.string().required('El nombre es requerido'),
  jobPosition: yup.string(),
  lastName: yup.string(),
  image: yup.string().url(),
  online: yup.boolean(),
})

// users: yup.array().of(userSchema).required('Selecciona al menos un usuario')

const schema = yup.object().shape({
  name: yup.string().required('El nombre es requerido'),
  start: yup.string().required('La fecha de inicio es requerida'),
  end: yup.string().required('La fecha de fin es requerida'),
  statusObjec: yup.object().required('El estado es requerido'),
  checkpoints: yup.array().of(checkpointSchema),
  // users: yup.array().of(userSchema).required('Selecciona al menos un usuario'),
  // profiles: yup.array().min(1, 'Debes seleccionar al menos un perfil'),
})

export default function CreateRound({ initialValues }: IProps) {
  const { t } = useTranslation()

  const [isChecked, setIsChecked] = useState(false)
  const [isCheckedUser, setIsCheckedUser] = useState(false)

  const handleToggle = () => {
    setIsChecked(!isChecked)
    setValue('dayObjec', [])
  }

  const handleToggleUser = () => {
    setIsCheckedUser(!isCheckedUser)
    setValue('profiles', [])
    setValue('users', [])
    setSelectedUsers([])

    delete errors.users
    delete errors.profiles
  }

  const [endDate, setEndDate] = useState<Date>()

  const { mutate: create, isLoading: createLoading } = roundRegisterMutation()

  const router = useRouter()

  // const [searchTerm, setSearchTerm] = useState('')
  // const [searchJob, setSearchJob] = useState('')
  // const [page, setPage] = useState(1)

  // const { users } = useUsersQuery({
  //   limit: 100,
  //   page,
  //   search: searchTerm,
  //   jobPosition: searchJob,
  // })

  const {
    register,
    handleSubmit,
    setValue,
    control,
    trigger,
    resetField,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  // const jobPositions = userJobPosition()

  function convertDate(date: string) {
    return new Date(date).toISOString().slice(0, -5)
  }
  const [selectedUsers, setSelectedUsers] = useState([])
  const [selectedUProfiles, setSelectedProfles] = useState([])

  const handleSelectChange = (selectedOptions: any) => {
    setSelectedUsers(selectedOptions)
  }

  const [inputs, setInputs] = useState([{ id: 1 }])

  const handleAddInput = () => {
    const newId = inputs.length + 1
    setInputs([...inputs, { id: newId }])
  }

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
    // {
    //   title: 'Nombre',
    //   dataIndex: 'firstName',
    //   key: 'firstName',
    //   align: 'center' as AlignType,
    // },
    // {
    //   title: 'Apellido',
    //   dataIndex: 'lastName',
    //   key: 'lastName',
    //   align: 'center' as AlignType,
    // },
    {
      title: <span className="px-3 ">Perfil</span>,
      dataIndex: 'jobPosition',
      key: 'jobPosition',
      align: 'center' as AlignType,
    },
  ]

  const handleRemoveInput = (idToRemove: number) => {
    const updatedInputs = inputs.filter((input) => input.id !== idToRemove)
    setInputs(updatedInputs)

    const index = idToRemove - 1

    resetField(`checkpoints[${index}].name`)
    resetField(`checkpoints[${index}].location`)
    resetField(`checkpoints[${index}].latitude`)
    resetField(`checkpoints[${index}].longitude`)
    resetField(`checkpoints[${index}].time`)
  }

  async function onSubmit(values: any) {
    const diference = inputs.length

    if (diference !== values.checkpoints.length) {
      let slice = Math.abs(diference - values.checkpoints.length)
      values.checkpoints.splice(-slice)
    }

    // let userIds: any[] = []
    // if (values.profiles?.length < 0 || values.profiles === undefined) {
    //   values?.users?.forEach((element: any) => {
    //     const userId = {
    //       userId: element.value.toString(),
    //     }

    //     userIds.push(userId)
    //   })
    // } else {
    //   userIds = users
    //     .filter((objeto1) =>
    //       values.profiles.some(
    //         (objeto2: { value: string }) =>
    //           objeto2?.value === objeto1?.jobPosition
    //       )
    //     )
    //     .map((usuario) => ({ userId: usuario.id.toString() }))
    // }

    values.checkpoints.forEach((checkpoint: any) => {
      checkpoint.longitude = parseFloat(checkpoint.longitude)
    })

    values.checkpoints.forEach((checkpoint: any) => {
      checkpoint.latitude = parseFloat(checkpoint.latitude)
    })

    // values.user_roundParticipants = userIds
    values.status = values.statusObjec.label

    if (isChecked) {
      values.estimate = values.dayObjec.value
    } else {
      delete values.dayObjec
      delete values.estimate
    }

    delete values.users
    delete values.statusObjec
    delete values.profiles

    create({ ...values })
  }

  let data = selectedUsers.map((user: any) => ({
    id: user.value,
    firstName: user.label.split(' ')[0],
    image: user.image,
    jobPosition: user.jobPosition,
    lastName: user.lastName,
    online: user.online,
  }))
  const [selectedDateEnd, setSelectedDateEnd] = useState(null)
  const [selectedDatestart, setSelectedDatestart] = useState(null)

  const handleChange = (date: any, field: any) => {
    if (field === 'start') {
      setSelectedDatestart(date)
      setValue('start', date)
    } else {
      setSelectedDateEnd(date)
      setValue('end', date)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
          <Description
            title="Rondas"
            details={t('form:form-round-description') as string}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 text-justify"
          />
          {/* <Card className="mb-8 flex  items-center md:flex-row">
              <div className="my-5  w-full flex-wrap border-b border-dashed border-border-sbase pb-8 sm:my-8"> */}
          {/* <button
                  className={` ${
                    profile === false
                      ? ' bg-gray-500 hover:bg-slate-300 '
                      : 'bg-blue-500  hover:bg-blue-300 '
                  } text-white px-2 py-2 rounded-md  `}
                  type="button"
                  onClick={handleProfile}
                >
                  {profile === false
                    ? t('form:input-label-change-user-profile')
                    : t('form:input-label-change-profile-user')}
                </button> */}

          {/* <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    value=""
                    className="sr-only peer"
                    onChange={handleToggleUser}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900  ">
                    <p className="text-black">
                      {isCheckedUser === true
                        ? t('form:input-label-change-user-profile')
                        : t('form:input-label-change-profile-user')}
                    </p>
                  </span>
                </label>
                <div className="border-b-2 border-dashed my-5"></div>

                {isCheckedUser === false ? (
                  <>
                    <Label className="mb-4 mt-5">
                      {t('form:input-label-customers')}
                    </Label>

                    <Controller
                      control={control}
                      name="users"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Select
                          options={users?.map((user) => ({
                            value: user.id,
                            label:
                              user.firstName +
                              ' ' +
                              user.lastName +
                              ' - ' +
                              user.jobPosition,
                            image: user.image,
                            jobPosition: user.jobPosition,
                            lastName: user.lastName,
                            online: user.online,
                          }))}
                          placeholder={'Seleccione una opción'}
                          value={value}
                          onBlur={onBlur}
                          isMulti
                          // onChange={(selectedOptions) => {
                          //   setValue('users', selectedOptions) // Actualiza el valor de userSelect usando setValue
                          //   handleSelectChange(selectedOptions) // Llama a handleSelectChange si es necesario
                          // }}
                          onChange={(selectedOptions) => {
                            onChange(selectedOptions)
                            handleSelectChange(selectedOptions)
                          }}
                        />
                      )}
                    />
                    {errors.users && (
                      <span className="text-sm text-red-700">
                        {errors.users.message + '*'}
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <Label className="mb-4 mt-5">
                      {t('form:input-label-profiles')}
                    </Label>

                    <Controller
                      control={control}
                      name="profiles"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Select
                          options={jobPositions}
                          placeholder={'Seleccione una opción'}
                          value={value}
                          onBlur={onBlur}
                          isMulti
                          onChange={onChange}
                        />
                      )}
                    />
                    {errors.profiles && (
                      <span className="text-sm text-red-700">
                        {errors.profiles.message + '*'}
                      </span>
                    )}
                  </>
                )}
              </div>
            </Card> */}

          {/* <Card className="mb-8 flex  items-center md:flex-row">
              <div className="m-auto h-56 overflow-y-auto w-full">
                <Table
                  columns={columns}
             
                  data={data}
                  className="flex w-full"
                  emptyText={<div className="text-center">No hay datos</div>}
                  rowKey={'id'}
                />
              </div>
            </Card> */}

          <Card className="mb-5 w-full sm:w-8/12 md:w-2/3">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                onChange={handleToggle}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-900  ">
                <p className="text-black">Programar Ronda</p>
              </span>
            </label>
            <div className="border-b-2 border-dashed my-5"></div>

            <>
              <Input
                label={t('form:form-name-round') as string}
                {...register('name')}
                variant="outline"
                placeholder="Escriba el nombre"
                className=""
                disabled={initialValues?.id !== undefined}
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
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <div>
                    <DatePicker
                      showTimeSelect
                      placeholderText="Selecciona una fecha"
                      isClearable
                      dateFormat="dd/MM/yyyy h:mm aa"
                      onChange={(date) => {
                        onChange(date) // Actualiza el estado del formulario
                        handleChange(date, 'start') // Llama a la función de cambio personalizada
                      }}
                      onBlur={onBlur}
                      timeFormat="HH:mm:ss"
                      selected={selectedDatestart}
                      selectsEnd
                      timeIntervals={10}
                    />
                  </div>
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
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <div>
                    <DatePicker
                      showTimeSelect
                      placeholderText="Selecciona una fecha"
                      isClearable
                      dateFormat="dd/MM/yyyy h:mm aa"
                      onChange={(date) => {
                        onChange(date) // Actualiza el estado del formulario
                        handleChange(date, 'end') // Llama a la función de cambio personalizada
                      }}
                      onBlur={onBlur}
                      timeFormat="HH:mm:ss"
                      selected={selectedDateEnd}
                      selectsEnd
                      timeIntervals={10}
                    />
                  </div>
                )}
              />

              {errors.end && (
                <span className="text-sm text-red-700">
                  {errors.end.message + '*'}
                </span>
              )}

              {isChecked && (
                <>
                  <Label className="mb-4 mt-5">{t('form:form-day')}</Label>
                  <SelectInput
                    placeholder="Seleccione el dia"
                    control={control}
                    name={'dayObjec'}
                    options={daysWeek}
                  ></SelectInput>

                  {errors.statusObjec && (
                    <span className="text-sm text-red-700">
                      {errors.statusObjec.message + '*'}
                    </span>
                  )}
                </>
              )}

              <Label className="mb-4 mt-5">{t('form:form-status')}</Label>
              <SelectInput
                placeholder="Seleccione el estatus"
                control={control}
                name={'statusObjec'}
                options={statusOptions}
              ></SelectInput>

              {errors.statusObjec && (
                <span className="text-sm text-red-700">
                  {errors.statusObjec.message + '*'}
                </span>
              )}
            </>
            <div className="border-b-2 border-dashed my-5"></div>
            <>
              <h3 className="mb-3 text-xl">CheckPoint</h3>
              {inputs.map((input, index) => (
                <div key={input.id} className="w-full mr-4">
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div>
                      <Input
                        label={t('form:form-name') as string}
                        {...register(`checkpoints[${index}].name`)} // Aquí usamos una notación de cadena para registrar campos dinámicos
                        variant="outline"
                        className=""
                        placeholder="Escriba el nombre"
                        disabled={initialValues?.id !== undefined}
                      />
                      {errors?.checkpoints &&
                        (errors.checkpoints as unknown as any[])[index]
                          ?.name && (
                          <span className="text-sm text-red-700">
                            {(errors.checkpoints as unknown as any[])[index]
                              .name.message + '*'}
                          </span>
                        )}
                    </div>

                    <div>
                      <Input
                        label={t('form:form-location') as string}
                        {...register(`checkpoints[${index}].location`)} // Aquí usamos una notación de cadena para registrar campos dinámicos
                        variant="outline"
                        placeholder="Escriba la ubicación"
                        className=""
                      />

                      {errors?.checkpoints &&
                        (errors.checkpoints as unknown as any[])[index]
                          ?.location && (
                          <span className="text-sm text-red-700">
                            {(errors.checkpoints as unknown as any[])[index]
                              .location.message + '*'}
                          </span>
                        )}
                    </div>
                  </div>

                  <div className="grid grid-cols-12 mb-3 gap-2 items-center h-30">
                    <div className="col-span-4 h-10 mb-20">
                      <Input
                        label={t('form:form-latitude') as string}
                        {...register(`checkpoints[${index}].latitude`)} // Aquí usamos una notación de cadena para registrar campos dinámicos
                        type="number"
                        step="0.01" // Esto permite valores con dos decimales
                        variant="outline"
                        className=""
                        placeholder="Escriba la latitud"
                      />

                      {errors?.checkpoints &&
                        (errors.checkpoints as unknown as any[])[index]
                          ?.latitude && (
                          <span className="text-sm text-red-700">
                            {(errors.checkpoints as unknown as any[])[index]
                              .latitude.message + '*'}
                          </span>
                        )}
                    </div>

                    <div className="col-span-3  h-10 mb-20">
                      <Input
                        type="number"
                        placeholder="Escriba la longitud"
                        step="0.01" // Esto permite valores con dos decimales
                        label={t('form:form-longitude') as string}
                        {...register(`checkpoints[${index}].longitude`)} // Aquí usamos una notación de cadena para registrar campos dinámicos
                        variant="outline"
                        className=""
                        disabled={initialValues?.id !== undefined}
                      />

                      {errors.checkpoints &&
                        (errors.checkpoints as unknown as any[])[index]
                          ?.longitude && (
                          <span className="text-sm text-red-700">
                            {(errors.checkpoints as unknown as any[])[index]
                              .longitude.message + '*'}
                          </span>
                        )}
                    </div>

                    <div className="col-span-3  h-10 mb-20">
                      <Input
                        type="number"
                        placeholder={t('form:form-estimate') as string}
                        label={
                          (t('form:form-estimate') as string) + ' en minutos'
                        }
                        {...register(`checkpoints[${index}].time`)} // Aquí usamos una notación de cadena para registrar campos dinámicos
                        variant="outline"
                        className=""
                        disabled={initialValues?.id !== undefined}
                      />

                      {errors.checkpoints &&
                        (errors.checkpoints as unknown as any[])[index]
                          ?.longitude && (
                          <span className="text-sm text-red-700">
                            {(errors.checkpoints as unknown as any[])[index]
                              .time.message + '*'}
                          </span>
                        )}
                    </div>

                    <div className="col-span-2 gap-2 flex justify-center">
                      {index === inputs.length - 1 && (
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
                      )}

                      {index === inputs.length - 1 && (
                        <button
                          disabled={index == 7 ? true : false}
                          type="button"
                          className={`rounded-full border border-black hover:border-blue-400 ${
                            index === 7
                              ? 'cursor-not-allowed hover:border-gray-400 '
                              : ''
                          }`}
                          onClick={handleAddInput}
                        >
                          <PlusIcon
                            className={`${
                              index === 7
                                ? 'hover:text-gray-400 '
                                : 'hover:text-green-600 '
                            }`}
                            width={20}
                          />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </>
          </Card>

          <div className="w-full text-end">
            <Button
              type="button"
              onClick={() => router.back()}
              className="bg-zinc-600"
            >
              {t('form:form-button-back')}
            </Button>
            <Button
              className="mx-3"
              // loading={
              //   loading || loadingShifts || uploadLoading || createLoading
              // }
              // disabled={
              //   loading || loadingShifts || uploadLoading || createLoading
              // }
            >
              {initialValues
                ? t('form:form-update-round')
                : t('form:form-creaate-round')}
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}
