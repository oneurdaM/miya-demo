/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import pick from 'lodash/pick'
import { useForm } from 'react-hook-form'
import { Switch } from '@headlessui/react'
import { nanoid } from 'nanoid'

import {
  useCreateUserMutation,
  useJobPositionsQuery,
  useUpdateUserMutation,
} from '@/data/users'
import { useShiftQuery } from '@/data/shift'

import Card from '@/components/common/card'
import Description from '@/components/ui/description'
import FileInput from '@/components/ui/file-input'
import Input from '@/components/ui/input'
import Button from '@/components/ui/button'
import Label from '@/components/ui/label'
import SelectInput from '@/components/ui/select-input'
import WebcamComponent from '@/components/ui/webcam'
import { CloseIcon } from '@/components/icons/close-icon'

import { UsersResponse } from '@/types/users'
import { Sector, Shift } from '@/types/suggestions'
import { ROLES } from '@/utils/constants'
import { formatDate, jobPosition } from '@/utils/format-date'
import { useUploadMutation } from '@/data/upload'
import { userSectorListQuery } from '@/data/analytics'
import { capitalizeWords } from '@/utils/functions'

type IProps = {
  initialValues?: UsersResponse
}

type FormValue = {
  email: string
  firstName: string
  lastName: string
  birthDate: string
  registrationDate: string
  role: string
  username: string
  environmentId: string
  image: string
  shift?: Shift | null
  jobPosition?: any
  password: string
  middleName: string
  sector?: Sector | null
  icon?: string
}

export default function ProfileUpdateOrCreateForm({ initialValues }: IProps) {
  const { t } = useTranslation()
  const { mutate: updateUser, isLoading: loading } = useUpdateUserMutation()
  const [showCam, setShowCam] = useState(false)
  const { mutate: upload, isLoading: uploadLoading } = useUploadMutation()
  const { jobPositions } = useJobPositionsQuery()

  const jobPositionOptions = Array.isArray(jobPositions)
    ? jobPositions.map((doc: any) => ({
        label: capitalizeWords(doc.name),
        value: doc.id,
        icon: doc.icon,
      }))
    : []

  const { sector } = userSectorListQuery({
    limit: 100000,
    page: 1,
  })
  const [icon, setIcon] = useState<any>({
    label: initialValues?.jobPosition?.name ?? '',
    icon: initialValues?.icon ?? '',
    value: initialValues?.jobPosition?.id ?? '',
  })

  const { mutate: create, isLoading: createLoading } = useCreateUserMutation()

  const { shifts, loading: loadingShifts } = useShiftQuery({
    limit: 20,
    page: 1,
  })

  const { register, control, handleSubmit, reset } = useForm<FormValue>({
    ...(Boolean(initialValues) && {
      defaultValues: {
        ...initialValues,
        registrationDate: formatDate(initialValues?.registrationDate ?? ''),
        role: {
          label: initialValues?.role,
          value: initialValues?.role,
        },
        jobPosition: {
          label: initialValues?.jobPosition?.name,
          value: initialValues?.jobPosition?.id,
        },
      } as any,
    }),
  })

  useEffect(() => {
    if (initialValues) {
      reset({
        ...initialValues,
        registrationDate: formatDate(initialValues?.registrationDate ?? ''),
        //@ts-ignore
        role: {
          label: initialValues?.role,
          value: initialValues?.role,
        },
        jobPosition: {
          label: initialValues?.jobPosition?.name,
          value: initialValues?.jobPosition?.id,
        },
      })
    }
  }, [initialValues, reset])

  useEffect(() => {
    if (initialValues?.icon) {
      setIcon({
        label: initialValues?.jobPosition?.name,
        icon: initialValues?.icon,
        value: initialValues?.jobPosition?.id,
      })
    }
  }, [initialValues])

  async function onSubmit(values: any) {
    values.username = values.email
    // values.shift = values.shift.id
    values.Sector = values.Sector?.id
    values.shiftId = values.shift?.id

    const input: any = {
      id: initialValues?.id,
      input: {
        role: values.role?.value,
        ...pick(values, [
          'email',
          'firstName',
          'lastName',
          'birthDate',
          'registrationDate',
          'username',
          'environmentId',
          'image',
          'shiftId',
          'password',
          'jobPosition',
          'middleName',
          'sector',
          'shift',
        ]),
      },
    }

    input.input.icon = icon.icon

    if (initialValues?.id !== undefined) {
      const updateData = {
        ...input.input,
        id: initialValues?.id,
        shiftId: values?.shift.id,
        sectorId: values.Sector,
        jobPositionId: values?.jobPosition.value,
        registrationDate: initialValues?.registrationDate ?? new Date(),
      }
      updateUser({
        ...updateData,
      })
    } else {
      const createData = {
        ...input.input,
        shift: values?.shift.id,
        Sector: values?.sector.id,
        jobPositionId: values?.jobPosition.value,
      }
      create({ ...createData })
    }
  }

  function changeStatus(status: boolean) {
    setShowCam(status)
  }

  // On save Selfie image
  const onSaveSelfie = (image: string) => {
    const id = nanoid(10)

    const formData = new FormData()
    const binaryData = atob(image.split(',')[1])
    const arrayBuffer = new ArrayBuffer(binaryData.length)

    const view = new Uint8Array(arrayBuffer)
    for (let i = 0; i < binaryData.length; i++) {
      view[i] = binaryData.charCodeAt(i)
    }

    const nameImage = 'image' + id + '.jpg'
    const blob = new Blob([arrayBuffer], { type: 'image/jpeg' })
    formData.append('file', blob, nameImage)
    upload(formData, {
      onSuccess(data, _variables, _context) {
        const dataUrl = {
          target: {
            name: 'image',
            value: data,
          },
        }
        register('image').onChange(dataUrl)
      },
    })
  }

  function handleJobposition(icon: any) {
    console.log(icon)
    setIcon(icon)
  }

  return (
    <>
      <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
        <Description
          title={t('form:input-label-selfie-text') ?? ''}
          details={t('form:selfie-help-text') ?? ''}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        {initialValues?.image && !showCam ? (
          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div className="relative">
              <div className="flex justify-center">
                <Image
                  src={initialValues?.image}
                  alt="Profile"
                  className="w-60 h-60 rounded-md"
                  width={450}
                  height={450}
                />
              </div>

              <span
                className="absolute cursor-pointer top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white p-2 rounded-full"
                onClick={() => changeStatus(!showCam)}
              >
                <CloseIcon className="w-4 h-4" />
              </span>
            </div>
          </Card>
        ) : (
          <Card className="w-full sm:w-8/12 md:w-2/3">
            {showCam ? (
              <WebcamComponent onSave={onSaveSelfie} />
            ) : (
              <FileInput name="image" control={control} multiple={false} />
            )}
            <Switch
              checked={showCam}
              onChange={(value) => changeStatus(value)}
              disabled={false}
              className={`${
                showCam ? 'bg-accent' : 'bg-gray-300'
              } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none mt-5`}
            >
              <span
                className={`${
                  showCam ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-light`}
              />
            </Switch>

            <p className="mt-2 text-xs text-gray-500">
              {t('form:webcam-text')}
            </p>
          </Card>
        )}
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
          <Description
            title="Nombre"
            details={t('form:form-update-user-description') as string}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          <Card className="mb-5 w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t('form:form-email') as string}
              {...register('email')}
              variant="outline"
              className="mb-5"
              disabled={initialValues?.id !== undefined}
            />
            <Input
              label={t('form:form-password') as string}
              {...register('password')}
              type="password"
              variant="outline"
              className="mb-5"
              disabled={initialValues?.id !== undefined}
            />
            {/* Column with Nombre and Apellido Input */}
            <div className="flex flex-wrap">
              <div className="w-full sm:w-1/2">
                <Input
                  label={t('form:form-first-name') as string}
                  {...register('firstName')}
                  variant="outline"
                  className="mb-5 mr-5"
                />
              </div>
              <div className="w-full sm:w-1/2">
                <Input
                  label={t('form:form-last-name') as string}
                  {...register('lastName')}
                  variant="outline"
                  className="mb-5 ml-5"
                />
              </div>
            </div>
            <Input
              label={t('form:form-middle-name') as string}
              {...register('middleName')}
              variant="outline"
              className="mb-5"
              disabled={initialValues?.id !== undefined}
            />

            <div className="mb-5 mt-5">
              <Label>{`${t('form:form-select-role')}`}</Label>
              <SelectInput
                {...register('role')}
                control={control}
                getOptionLabel={(option: any) => option.label}
                getOptionValue={(option: any) => option.value}
                options={ROLES}
                onChange={() => {
                  console.log('test')
                }}
              />
            </div>

            <Label className="mb-4 mt-5">{`${t(
              'form:form-select-shift'
            )}`}</Label>
            <SelectInput
              {...register('shift')}
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={shifts ?? []}
              isMulti={false}
              onChange={() => {
                console.log('test')
              }}
            />

            <Label className="mb-4 mt-5">{`${t(
              'form:form-select-sector'
            )}`}</Label>
            <SelectInput
              {...register('sector')}
              control={control}
              getOptionLabel={(option: any) => option.name}
              getOptionValue={(option: any) => option.id}
              options={sector ?? []}
              isMulti={false}
              onChange={() => {
                console.log('test')
              }}
            />

            <Label className="mb-4 mt-5">
              {t('form:form-select-job-position')}
            </Label>
            <SelectInput
              {...register('jobPosition')}
              control={control}
              getOptionValue={(option: any) => option.value}
              getOptionLabel={(option: any) => option.label}
              options={jobPositionOptions}
              isMulti={false}
              isLoading={jobPositionOptions.length > 0 ? false : true}
              onChange={(value: any) => {
                handleJobposition(value)
              }}
            />

            <div className="border-2 rounded-b-md flex justify-center">
              {icon.icon ? (
                <Image
                  src={icon.icon}
                  alt="Profile"
                  className="w-20 h-20 rounded-md"
                  width={50}
                  height={50}
                />
              ) : (
                <span className="text-center py-3 text-gray-400 ">
                  Selecciona una posición
                </span>
              )}
            </div>
          </Card>

          <div className="w-full text-end">
            <Button
              loading={
                loading || loadingShifts || uploadLoading || createLoading
              }
              disabled={
                loading || loadingShifts || uploadLoading || createLoading
              }
            >
              {initialValues
                ? t('form:form-update-user')
                : t('form:form-create-user')}
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}
