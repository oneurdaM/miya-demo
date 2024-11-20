/* eslint-disable @typescript-eslint/no-explicit-any */
import React,{useEffect} from 'react'
import {useTranslation} from 'react-i18next'
import {useForm} from 'react-hook-form'

import Card from '@/components/common/card'
import Description from '@/components/ui/description'
import Input from '@/components/ui/input'
import Button from '@/components/ui/button'


import {useRouter} from 'next/router'

import {
  useCreateDocumentTypeMutation,
  useUpdateDocumentTypeMutation,
} from '@/data/documents_type'

type DocumentTypeFormProps = {
  name: string
}

type IProps = {
  initialValues?: DocumentTypeFormProps
}

export default function CreateDocument({initialValues}: IProps) {
  const {t} = useTranslation()

  const router = useRouter()
  const {
    query: {id},
  } = router

  const {mutate: create,isLoading: createLoading} =
    useCreateDocumentTypeMutation()

  const {mutate: update,isLoading: updateLoading} =
    useUpdateDocumentTypeMutation()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<any>({
    defaultValues: {
      ...initialValues,
      name: initialValues?.name,
    },
  })

  useEffect(() => {
    if (initialValues) {
      reset(initialValues)
    }
  },[initialValues,reset])

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
            title="Crear tipo de documento"
            details="Escribe el nombre del documento que se asignara a la posición de trabajo."
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
                ? 'Actualizar tipo documento'
                : t('Crear tipo documento')}
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}
