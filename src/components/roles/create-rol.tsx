/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Image from 'next/image'
import pick from 'lodash/pick'
import { useForm } from 'react-hook-form'
import { Switch } from '@headlessui/react'
import { nanoid } from 'nanoid'
import { addIcon } from '@/utils/addicon'

import { useCreateUserMutation, useUpdateUserMutation } from '@/data/users'
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

import { JobPosition, UsersResponse } from '@/types/users'
import { Shift } from '@/types/suggestions'
import { ROLES } from '@/utils/constants'
import { formatDate, jobPosition } from '@/utils/format-date'
import { useUploadMutation } from '@/data/upload'
import router, { useRouter } from 'next/router'
import { SectorReponse } from '@/types/sector'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  checkpointRegisterMutation,
  useUpateCheckpointMutation,
} from '@/data/round'
import {
  useCreateJobPositionMutation,
  useUpdateJobPositionMutation,
} from '@/data/job-position'

type CheckpointFormProps = {
  name: string
}

type IProps = {
  initialValues?: CheckpointFormProps
}

export default function CreateRol({ initialValues }: IProps) {
  const { t } = useTranslation()

  const router = useRouter()
  const {
    query: { id },
  } = router

  const { mutate: create, isLoading: createLoading } =
    useCreateJobPositionMutation()

  const { mutate: update, isLoading: updateLoading } =
    useUpdateJobPositionMutation()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      ...initialValues,
      name: initialValues?.name,
    },
  })

  async function onSubmit(values: any) {
    if (initialValues !== undefined) {
      update(values)
    } else {
      const input = {
        name: values.name,
      }
      create(input)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
          <Description
            title="Posición de trabajo"
            details="Escribe el nombre de la posición de trabajo."
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          <Card className="mb-5 w-full sm:w-8/12 md:w-2/3">
            <Input
              label="Nombre"
              {...register('name')}
              variant="outline"
              className="mx-2 mb-4"
              required
              placeholder="Nombre"
            />
          </Card>

          <div className="w-full text-end">
            <Button
              type="button"
              onClick={() => router.back()}
              className="bg-zinc-600 mx-3"
            >
              {t('form:form-button-back')}
            </Button>
            <Button loading={createLoading} disabled={createLoading}>
              {initialValues
                ? 'Actualizar Posición'
                : t('form:form-button-jobposition')}
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}
