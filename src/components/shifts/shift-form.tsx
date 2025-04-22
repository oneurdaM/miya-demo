import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'

import Description from '@/components/ui/description'
import Card from '@/components/common/card'
import Input from '@/components/ui/input'
import StickyFooterPanel from '@/components/ui/sticky-footer-panel'
import Button from '@/components/ui/button'
import { Shift } from '@/types/suggestions'
import { useRouter } from 'next/router'
import { useCreateShiftMutation, useUpateShiftMutation } from '@/data/shift'
import { yupResolver } from '@hookform/resolvers/yup'
import { ShiftSchema } from './schema.shitf-validation'
// import {ValidationError} from "yup";

type FormValues = {
  name: string
  start: string
  end: string
}

type IProps = {
  initialValues?: Shift
}

export default function CreateOrUpdateShiftForm({ initialValues }: IProps) {
  const router = useRouter()
  const { t } = useTranslation()

  const { mutate: create, isLoading: creating } = useCreateShiftMutation()
  const { mutate: update, isLoading: updating } = useUpateShiftMutation()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(ShiftSchema),
    ...(Boolean(initialValues) && {
      defaultValues: {
        ...initialValues,
      } as any,
    }),
  })


  const buildISODate = (date: Date, time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    const fullDate = new Date(date);
    fullDate.setHours(hour, minute, 0, 0); // hora, minuto, segundo, ms
    return fullDate.toISOString();
  };
  


  const onSubmit = async (values: FormValues) => {
    if (!initialValues) {
      const currentDate = new Date() // Obtiene la fecha actual
      values.start = buildISODate(currentDate, values.start);
      values.end = buildISODate(currentDate, values.end);

      create({
        ...values,
      })
    } else {
      update({
        ...initialValues,
        id: initialValues.id.toString(),
        ...values,
      })
    }
  }

  

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:input-label-shift-name')!}
          description={t('form:input-placeholder-shift-name')!}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-title')!}
            {...register('name')}
            error={t(errors.name?.message!)!}
            variant="outline"
            className="mb-5"
          />
          <div className="flex flex-wrap -mx-5">
            <div className="w-full px-5 sm:w-1/2">
              <Input
                label={t('form:input-label-start-time')!}
                {...register('start')}
                error={t(errors.start?.message!)!}
                variant="outline"
                type="time"
                className="mb-5"
              />
            </div>
            <div className="w-full px-5 sm:w-1/2">
              <Input
                label={t('form:input-label-end-time')!}
                {...register('end')}
                error={t(errors.end?.message!)!}
                variant="outline"
                type="time"
                className="mb-5"
              />
            </div>
          </div>
        </Card>
      </div>

      <StickyFooterPanel className="z-10">
        <div className="text-end">
          <Button
            type="button"
            onClick={() => router.back()}
            className="bg-zinc-600 mx-3"
          >
            {t('form:form-button-back')}
          </Button>

          <Button
            loading={creating || updating}
            disabled={creating || updating}
            className="text-sm md:text-base"
          >
            {initialValues
              ? t('form:button-label-update-shift')
              : t('form:button-label-add-shift')}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  )
}
