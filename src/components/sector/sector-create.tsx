import React,{useEffect,useState} from 'react'
import {useTranslation} from 'react-i18next'
import pick from 'lodash/pick'
import {useForm} from 'react-hook-form'
import Card from '@/components/common/card'
import Description from '@/components/ui/description'
import Input from '@/components/ui/input'
import Button from '@/components/ui/button'
import {useCreateSectorMutation,useUpdateSector} from '@/data/analytics'
import {useRouter} from 'next/router'
import {SectorReponse} from '@/types/sector'
import {yupResolver} from '@hookform/resolvers/yup'
import {SectoreSchema} from './schema-validation-sector'
import SectorMap from './sectorMap'

type IProps = {
  initialValues?: SectorReponse
}

type FormValue = {
  name: string
}


export default function SectorCreate({initialValues}: IProps) {
  const {t} = useTranslation()
  const router = useRouter()

  const {
    query: {id},
  } = router

  const {mutate: create, isLoading: createLoading} = useCreateSectorMutation()
  const {mutate: update, isLoading: updateLoading} = useUpdateSector()

  const [latLng, setLatLng] = useState<any>()

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm<FormValue>({
    resolver: yupResolver(SectoreSchema),
    ...(Boolean(initialValues) && {
      defaultValues: {
        name: initialValues?.name,
      },
    }),
  })

  useEffect(() => {
    reset({
      name: initialValues?.name,
    })
  }, [initialValues])

  async function onSubmit(values: any) {
    const input: any = {
      id: initialValues?.id,
      input: {
        ...pick(values, ['name']),
      },
    }

    if (initialValues !== undefined) {
      const updateData = {
        id: id,
        name: values?.name,
        coordinates: {...latLng},
      }
      update(updateData)
    } else {
      const createData = {
        ...input.input,
        coordinates: {...latLng},
      }
      create({...createData})
    }
  }

  const handleCoordinatesChange = (coordinates: {lat: number; lng: number}[]) => {
    setLatLng(coordinates)
  }

  const isCoordinatesValid = () => latLng && latLng.length > 0

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="my-5 flex flex-wrap border-b border-dashed border-border-base pb-8 sm:my-8">
          <Description
            title="Sector"
            details={t('form:form-update-sector-description') as string}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />
          <Card className="mb-5 w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t('form:form-name') as string}
              {...register('name')}
              variant="outline"
              className="mb-5"
              required
              error={errors.name?.message}
            />
          </Card>
          <Description
            title="Ubicación del sector"
            details={t('form:form-update-sector-map-marker') as string}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="mb-5 w-full sm:w-8/12 md:w-2/3">
            <SectorMap
              onCoordinatesChange={handleCoordinatesChange}
              coordinates={initialValues?.coordinates}
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
            <Button
              loading={createLoading || updateLoading}
              disabled={!isCoordinatesValid()}
            >
              {initialValues
                ? t('form:form-update-sector')
                : t('form:form-create-sector')}
            </Button>
          </div>
        </div>
      </form>
    </>
  )
}
