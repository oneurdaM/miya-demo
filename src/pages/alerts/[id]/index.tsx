/* eslint-disable @typescript-eslint/no-explicit-any */
import {useRouter} from 'next/router'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import AppLayout from '@/components/layout/app'
import {useAlertEditMutation,useAlertQuery} from '@/data/alert'
import Loader from '@/components/ui/loader/loader'
import ErrorMessage from '@/components/ui/error-message'
import Card from '@/components/common/card'
import StickerCard from '@/components/widgets/sticker-card'
import {PinMap} from '@/components/icons/sidebar/pin-map-icon'
import {TagIcon,UsersIcon} from '@/components/icons/sidebar'
import GoogleMap from '@/components/map/googlemap'
import {useEffect,useState} from 'react'
import {Routes} from '@/config/routes'
import Label from '@/components/ui/label'
import {AlertStatus,AlertStatusArray} from '@/types/alerts'
import {useTranslation} from 'react-i18next'
import Select from '@/components/select/select'
import {useMeQuery} from '@/data/user'
import {getAlertStatus} from '@/utils/alert-status'
import Button from '@/components/ui/button'
import {Fancybox} from '@fancyapps/ui'
import {formatDateCabos} from '@/utils/format-date'
import Image from 'next/image'
export default function AlertDetail() {
  const {t} = useTranslation()
  const router = useRouter()
  const {
    query: {id},
  } = router

  useEffect(() => {
    Fancybox.bind('[data-fancybox="gallery"]',{})
  },[])

  const {alert,error,loading} = useAlertQuery({
    id: Number(id),
  })

  const {data: me} = useMeQuery()

  const {mutate: editAlert,isLoading: editing} = useAlertEditMutation()
  const [center,setCenter] = useState<google.maps.LatLngLiteral>({
    lat: alert?.latitude ?? 37.78746222,
    lng: alert?.longitude ?? -122.412923,
  })

  const [zoom,setZoom] = useState<number>(15)

  if (loading) return <Loader />

  if (error) return <ErrorMessage message={'error'} />


  const onIdle = (map: google.maps.Map) => {
    setZoom(map.getZoom()!)

    const nextCenter = map.getCenter()

    if (nextCenter) {
      setCenter(nextCenter.toJSON())
    }
  }

  const onSubmit = (data: any) => {
    editAlert({
      id: alert?.id.toString() ?? '',
      status: data.value,
      attendedBy: me?.id,
    })
  }

  function back() {
    router.back()
  }

  return (
    <>
      <Card className="mb-8">
        <div className="mb-4 flex w-full flex-col sm:flex-row sm:items-center sm:justify-between">
          <Button onClick={back}>{t('form:form-button-back')}</Button>
          <Label className="mb-2 sm:mb-0">{t('common:alert-status')}</Label>
          <Label className="border rounded-md p-3">
            {
              formatDateCabos(
                alert?.createdAt ?? ''
              ).label
            }
          </Label>

          <Select
            name="status"
            getOptionLabel={(option: any) => t(getAlertStatus(option.value))}
            getOptionValue={(option: any) => option.value}
            options={AlertStatusArray}
            isLoading={editing}
            onChange={(e: any) => {
              onSubmit(e)
            }}
            placeholder={'Alert status'}
            defaultValue={
              AlertStatusArray.find((item) => item.value === alert?.status) ??
              ''
            }
          />
        </div>
        <div className="mb-6 grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <div className="w-full">
            <StickerCard
              titleTransKey={t('common:alert-status-following')}
              subtitleTransKey={t('common:alert-following-status')}
              icon={<PinMap className="h-7 w-7" color="#00a29e" />}
              iconBgStyle={{backgroundColor: '#00a29e'}}
              status={alert?.status ?? AlertStatus.Created}
            />
          </div>
          <div className="w-full">
            <StickerCard
              titleTransKey={t('common:geolocation-of-alert')}
              subtitleTransKey={t('common:alert-location')}
              icon={<PinMap className="h-7 w-7" color="#00a29e" />}
              iconBgStyle={{backgroundColor: '#a7f3d0'}}
              linkText={t('common:view-on-google-maps')}
              link={`https://www.google.com/maps/search/?api=1&query=${alert?.latitude},${alert?.longitude}`}
            />
          </div>
          <div className="w-full">
            <StickerCard
              titleTransKey={t('common:who-generated-alert')}
              subtitleTransKey={t('common:information-displayed')}
              icon={<UsersIcon className="h-7 w-7" color="#d60000" />}
              iconBgStyle={{backgroundColor: '#ffafaf'}}
              price={alert?.user?.name}
              className="w-full border-2 border-gray-200"
              link={Routes.users.details({
                id: alert?.user?.id?.toString() ?? '',
              })}
              linkText={t('common:view-user-information')}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <StickerCard
            subtitleTransKey={t('common:alert-location')}
            icon={<TagIcon className="h-7 w-7" color="#d60000" />}
            iconBgStyle={{backgroundColor: '#a7f3d0'}}
            linkText={t('common:view-on-google-maps')}
          >
            <div className="mt-2 flex justify-center ">
              {alert?.image ? (
                <div className="w-3/4 flex justify-center">
                  <div>
                    <a data-fancybox="gallery" href={alert?.image}>
                      <Image src={alert?.image} alt="Imagen" width={200} />
                    </a>
                  </div>
                </div>
              ) : null}

              <div className="w-2/4 h-full ">
                <StickerCard
                  titleTransKey="Contenido"
                  subtitleTransKey={t('common:information-displayed')}
                  icon={<UsersIcon className="h-7 w-7" color="#d60000" />}
                  iconBgStyle={{backgroundColor: '#ffafaf'}}
                  price={
                    <div className="text-justify text-sm">
                      {alert?.content}
                    </div>
                  }
                  className="w-full border-2 border-gray-200"
                  link={Routes.users.details({
                    id: alert?.user?.id?.toString() ?? '',
                  })}
                  linkText={t('common:view-user-information')}
                />
              </div>
            </div>
          </StickerCard>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium leading-6 text-gray-700 hover:text-gray-900">
            {t('common:last-location-of-user')}
          </h3>
        </div>
        <div className="relative h-screen">
          {alert?.latitude && alert?.longitude ? (
            <GoogleMap
              apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY ?? ''}
              center={center}
              zoom={zoom}
              marker={alert}
              onIdle={onIdle}
              onMarkerClick={() => { }}
              highlightedMarkerId={alert?.id.toString()}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <p className="text-lg font-medium leading-6 text-gray-700 hover:text-gray-900">
                {t('common:not-found-user-location')}
              </p>
            </div>
          )}
        </div>
      </Card>
    </>
  )
}

AlertDetail.Layout = AppLayout

export const getServerSideProps = async ({locale}: any) => ({
  props: {
    ...(await serverSideTranslations(locale,['common','form','table'])),
  },
})
