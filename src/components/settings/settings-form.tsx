import { useForm } from 'react-hook-form'
import { CreateSettings, Settings } from '@/types/settings'
import { useTranslation } from 'next-i18next'

import Description from '../ui/description'
import Card from '../common/card'
import FileInput from '../ui/file-input'
import Input from '../ui/input'
import TextArea from '../ui/text-area'
import Button from '../ui/button'
import {
  useCreateSettingsMutation,
  useUpdateSettingsMutation,
} from '@/data/settings'
import Image from 'next/image'
import { yupResolver } from '@hookform/resolvers/yup'
import { SettingsSchema } from './schema-settings-validations'
import { useRouter } from 'next/router'

type SettingsFormProps = {
  initialValues?: Settings
}
export default function CreateOrUpdateSettingsForm({
  initialValues,
}: SettingsFormProps) {
  const { t } = useTranslation()

  const router = useRouter()
  const {
    mutate: updateMutation,
    isLoading: updating,
    error: errorUpdating,
  } = useUpdateSettingsMutation()
  const {
    mutate: createMutation,
    isLoading: creating,
    error: errorCreating,
  } = useCreateSettingsMutation()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateSettings>({
    resolver: yupResolver(SettingsSchema),
    defaultValues: initialValues ?? {
      logo: '',
      siteName: '',
      siteSubtitle: '',
      currency: '',
      metaTitle: '',
    },
  })

  const isEmptyObject = (obj: any) => {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object
  }

  async function onSubmit(values: CreateSettings) {
    if (isEmptyObject(initialValues)) {
      //@ts-ignore
      delete values.message
      //@ts-ignore
      delete values.data
      createMutation({
        ...values,
        ogImage: values.ogImage ? values.ogImage : null,
        logo: values.logo ? values.logo : null,
        // currency: 'MXN',
      })
    } else {
      updateMutation({
        //@ts-ignore
        id: initialValues?.id.toString(),
        ...values,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="sm:my8 my-5 flex flex-wrap">
        <Description
          title={'Logo del ambiente principal'}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
          details={'Esta imágen se mostrará en la app y en el sitio web.'}
        />
        <Card className="mb-5 w-full sm:w-8/12 md:w-2/3">
          <FileInput name="logo" control={control} multiple={false} />
          <div>
            {initialValues?.logo ? (
              <Image src={initialValues.logo} width={100} height={100} alt="" />
            ) : null}
          </div>
        </Card>

        <Description
          title={'SEO'}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
          details={'Información para el posicionamiento en buscadores.'}
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            variant="outline"
            label="Meta siteName"
            {...register('siteName', { required: false })}
            error={errors.metaTitle?.message}
            className="mb-2"
          />
          <Input
            variant="outline"
            label="Meta siteSubtitle"
            {...register('siteSubtitle', { required: false })}
            error={errors.metaTitle?.message}
            className="mb-2"
          />
          <Input
            variant="outline"
            label="Meta título"
            {...register('metaTitle', { required: false })}
            error={errors.metaTitle?.message}
            className="mb-2"
          />
          <TextArea
            variant="outline"
            label="Meta descripción"
            {...register('metaDescription', { required: false })}
            error={errors.metaDescription?.message}
            className="mb-2"
          />

          <Input
            variant="outline"
            label="Meta Tags"
            {...register('metaTags', { required: false })}
            error={errors.metaTags?.message}
            className="mb-2"
          />
          <Input
            variant="outline"
            label="Canonical"
            {...register('canonicalUrl', { required: false })}
            error={errors.canonicalUrl?.message}
            className="mb-2"
          />
          <div className="mb-5 grid grid-cols-2 gap-4">
            <Input
              variant="outline"
              label="OG Title"
              {...register('ogTitle', { required: false })}
              error={errors.ogTitle?.message}
              className="mb-2"
            />

            <Input
              variant="outline"
              label="OG Description"
              {...register('ogDescription', { required: false })}
              error={errors.ogDescription?.message}
              className="mb-2"
            />
          </div>
          <Input
            variant="outline"
            label="OG URL"
            {...register('ogUrl', { required: false })}
            error={errors.ogUrl?.message}
            className="mb-5"
          />
          <FileInput name="ogImage" control={control} multiple={false} />
          <div>
            {initialValues?.ogImage ? (
              <Image
                src={initialValues.ogImage}
                width={100}
                height={100}
                alt=""
              />
            ) : null}
          </div>

          <div className="mb-5 mt-5 grid grid-cols-2 gap-4">
            <Input
              variant="outline"
              label="Twitter Handle"
              {...register('twitterHandle', { required: false })}
              error={errors.twitterHandle?.message}
              className="mb-2"
            />

            <Input
              variant="outline"
              label="Twitter Card"
              {...register('twitterCardType', { required: false })}
              error={errors.twitterCardType?.message}
              className="mb-2"
            />
          </div>
        </Card>

        <Description
          variant="outline"
          title={'Redes sociales'}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
          details={'Información para el posicionamiento en buscadores.'}
        />

        <Card className="mt-5 w-full sm:w-8/12 md:w-2/3">
          <div className="mb-5 grid grid-cols-2 gap-4">
            <Input
              variant="outline"
              label="Facebook"
              {...register('facebookUrl', { required: false })}
              error={errors.facebookUrl?.message}
              className="mb-2"
            />

            <Input
              variant="outline"
              label="Instagram"
              {...register('instagramUrl', { required: false })}
              error={errors.instagramUrl?.message}
              className="mb-2"
            />

            <Input
              variant="outline"
              label="Twitter"
              {...register('twitterUrl', { required: false })}
              error={errors.twitterUrl?.message}
              className="mb-2"
            />

            <Input
              variant="outline"
              label="Youtube"
              {...register('youtubeUrl', { required: false })}
              error={errors.youtubeUrl?.message}
              className="mb-2"
            />

            <Input
              variant="outline"
              label="LinkedIn"
              {...register('linkedinUrl', { required: false })}
              error={errors.linkedinUrl?.message}
              className="mb-2"
            />

            <Input
              variant="outline"
              label="Tiktok"
              {...register('tiktokUrl', { required: false })}
              error={errors.tiktokUrl?.message}
              className="mb-2"
            />
          </div>
        </Card>

        <Description
          variant="outline"
          title={'Información de contacto'}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
          details={'Información para el posicionamiento en buscadores.'}
        />

        <Card className="mt-5 w-full sm:w-8/12 md:w-2/3">
          <div className="mb-5 grid grid-cols-2 gap-4">
            <Input
              variant="outline"
              label="Localización"
              {...register('location', { required: false })}
              error={errors.location?.message}
              className="mb-2"
            />

            <Input
              variant="outline"
              label="Teléfono"
              {...register('contactNumber', { required: false })}
              error={errors.contactNumber?.message}
              className="mb-2"
            />

            <Input
              variant="outline"
              label="Website"
              {...register('website', { required: false })}
              error={errors.website?.message}
              className="mb-2"
            />
          </div>
        </Card>
      </div>

      <div className="mb-4 text-end">
        <Button
          type="button"
          onClick={() => router.back()}
          className="bg-zinc-600 mx-3"
        >
          {t('form:form-button-back')}
        </Button>
        <Button loading={updating || creating} disabled={updating || creating}>
          {t('form:button-label-save-settings')}
        </Button>
      </div>
    </form>
  )
}
