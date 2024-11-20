/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTranslation } from 'react-i18next'
;('lodash/pick')
import { useForm } from 'react-hook-form'
import Card from '@/components/common/card'
import Description from '@/components/ui/description'
import Input from '@/components/ui/input'
import Button from '@/components/ui/button'
import { useRouter } from 'next/router'
import {
  checkpointRegisterMutation,
  useUpateCheckpointMutation,
} from '@/data/round'

type CheckpointFormProps = {
  location: string
  latitude: string
  longitude: string
  checkedAt: string
  roundId: string
}

type IProps = {
  initialValues?: CheckpointFormProps
}

export default function CheckpointCreate({ initialValues }: IProps) {
  const { t } = useTranslation()

  const router = useRouter()
  const {
    query: { id },
  } = router

  const { mutate: create, isLoading: createLoading } =
    checkpointRegisterMutation()

  const { mutate: update, isLoading: updateLoading } =
    useUpateCheckpointMutation()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    defaultValues: initialValues,
  })

  async function onSubmit(values: any) {
    if (initialValues !== undefined) {
      values.longitude = parseFloat(values.longitude)
      values.latitude = parseFloat(values.latitude)
      update(values)
    } else {
      const input = {
        roundId: Number(id),
        longitude: parseFloat(values.longitude),
        latitude: parseFloat(values.latitude),
        location: values.location,
        checkedAt: null,
      }
      create(input)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
          <Description
            title="Checkpoint"
            details="Escribe la infromacón que tendra este checkpoint para la ronda que tiene asignada."
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          <Card className="mb-5 w-full sm:w-8/12 md:w-2/3">
            <Input
              label="Locación"
              {...register('location')}
              variant="outline"
              className="mx-2 mb-4"
              required
              placeholder="Locación"
            />
            {initialValues !== undefined ? (
              <Input
                label="Ronda Id"
                {...register('roundId')}
                variant="outline"
                className="mx-2 mb-4"
                disabled={true}
              />
            ) : null}

            <div className="grid grid-cols-2">
              <Input
                type="number"
                step="any"
                required={false}
                label="Latitud"
                {...register('latitude')}
                variant="outline"
                className="mx-2"
                placeholder="Latitud"
              />
              <Input
                type="number"
                step="any"
                required={false}
                label="Longuitud"
                {...register('longitude')}
                variant="outline"
                className="mx-2"
                placeholder="Longuitud"
              />
            </div>
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
              {initialValues ? 'Actualizar checkpoint' : 'Crear checkpoint'}
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}
