import {useState} from 'react'
import Image from 'next/image'
import {useForm} from 'react-hook-form'
import {useTranslation} from 'react-i18next'

import TextArea from '@/components/ui/text-area'
import Button from '@/components/ui/button'
import {useModalState} from '@/components/ui/modal/modal.context'
import Label from '@/components/ui/label'
import Select from '@/components/ui/select/select'
import Loader from '@/components/ui/loader/loader'
import {MapPin} from '@/components/icons/map-pin'

import {useMeQuery} from '@/data/user'
import {useAlertEditMutation,useAlertQuery} from '@/data/alert'

import {getAlertStatus} from '@/utils/alert-status'
import {siteSettings} from '@/settings/site.settings'
import {AlertStatus,AlertStatusArray} from '@/types/alerts'

const AlertChangeStatus = () => {
  const {t} = useTranslation()
  const {data} = useModalState()
  const {data: me} = useMeQuery()
  const {mutate: editAlert,isLoading: editing} = useAlertEditMutation()
  const {alert,loading} = useAlertQuery({
    id: Number(data),
  })
  const {
    register,
    handleSubmit,
  } = useForm({
    defaultValues: {
      ...alert,
    },
  })

  const [status,setStatus] = useState('')

  if (loading) return <Loader />

  const onSubmit = (data: any) => {
    editAlert({
      id: alert?.id.toString() ?? '',
      status: status as AlertStatus,
      attendedBy: me?.id,
    })

    // closeModal();
  }

  return (
    <div className="m-auto w-full max-w-lg rounded bg-light sm:w-[32rem]">
      <div className="flex items-center border-b border-border-200 p-7">
        <div className="flex-shrink-0 rounded border border-border-100">
          <Image
            src={alert?.image ?? siteSettings.logo.url}
            alt={'Alert'}
            width={96}
            height={96}
            className="overflow-hidden rounded object-fill"
          />
        </div>

        <div className="ms-7">
          <h3 className="mb-2 text-sm font-semibold text-heading md:text-base">
            {alert?.user?.name} - {alert?.user?.email}
          </h3>
          <div className="text-sm text-body text-opacity-80">
            {t('form:text-alert-id')}:{' '}
            <span className="font-semibold text-accent">{alert?.id}</span>
          </div>
        </div>
      </div>
      <div className="px-7 pt-6 pb-7">
        <div className="mb-4 flex w-full flex-col sm:flex-row sm:items-center sm:justify-between">
          <Label className="mb-2 sm:mb-0">Estatus de la alerta</Label>
          <Select
            name="status"
            getOptionLabel={(option: any) => t(getAlertStatus(option.value))}
            getOptionValue={(option: any) => option.value}
            options={AlertStatusArray}
            isLoading={loading}
            onChange={(e: any) => {
              setStatus(e.value)
            }}
            placeholder={'Alert status'}
            defaultValue={
              AlertStatusArray.find((item) => item.value === alert?.status) ??
              ''
            }
          />
        </div>
        <div className="mb-4 text-sm font-semibold text-heading md:text-base">
          <span className="inline-block uppercase me-1">
            <MapPin />
          </span>
        </div>
        <form
          className="flex w-full flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextArea
            {...register('content')}
            placeholder={t('form:input-comment-placeholder') ?? ''}
            className="mb-4"
            disabled
          />
          <Button
            type="submit"
            loading={loading || editing}
            disabled={loading || editing}
            className="ms-auto"
          >
            {t('form:button-text-submit')}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default AlertChangeStatus
