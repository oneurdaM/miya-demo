import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  useCreateJobPositionMutation,
  useUpdateJobPositionMutation,
} from '@/data/job-position'
import { useRouter } from 'next/router'
import Button from '@/components/ui/button'
import Input from '@/components/ui/input'
import FileInput from '@/components/ui/file-input'
import Card from '@/components/common/card'
import Description from '@/components/ui/description'

type CheckpointFormProps = {
  name: string
  icon: string
  id: string
}

type IProps = {
  initialValues?: CheckpointFormProps
}

export default function CreateRol({ initialValues }: IProps) {
  const { t } = useTranslation()
  const router = useRouter()

  const { mutate: create, isLoading: createLoading } =
    useCreateJobPositionMutation()
  const { mutate: update, isLoading: updateLoading } =
    useUpdateJobPositionMutation()

  const {
    register,
    control,
    handleSubmit,
    reset, // Usamos reset para establecer los valores iniciales del formulario
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      name: initialValues?.name || '', // Establecemos valores predeterminados si ya existen
      icon: initialValues?.icon || '',
    },
  })

  // Esto se ejecutará cuando `initialValues` cambien
  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name,
        icon: initialValues.icon,
        id: initialValues.id,
      })
    }
  }, [initialValues, reset])

  const onSubmit = (values: any) => {
    if (initialValues !== undefined) {
      const inputUpdate = {
        name: values.name,
        icon: values.icon,
        id: values.id,
      }
      update(inputUpdate)
    } else {
      const input = {
        name: values.name,
        icon: values.icon,
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
            details={
              <>
                Escribe el nombre de la posición de trabajo y asigna un icono el
                cual se mostrara en el tracking del usuario. <br />
                <strong>
                  {' '}
                  La imagen debera ser en formato png y con tamaño de 48 x 48.
                </strong>
              </>
            }
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          <Card className="mb-5 w-full sm:w-8/12 md:w-2/3">
            <div className="mb-10">
              <FileInput
                name="icon"
                label="Icono de la posición"
                control={control}
                multiple={false}
                required={true}
              />
             
            </div>

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
