import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import AppLayout from '@/components/layout/app'
import { useSettingsQuery } from '@/data/settings'
import Loader from '@/components/ui/loader/loader'
import ErrorMessage from '@/components/ui/error-message'
import CreateOrUpdateSettingsForm from '@/components/settings/settings-form'
import { getAuthCredentials, hasAccess, adminOnly } from '@/utils/auth-utils'
import DontView from '@/components/dontView/dont-view'

export default function Settings() {
  const { t } = useTranslation()
  const { settings, error, loading } = useSettingsQuery()

  if (loading) return <Loader text={t('settings-loading') ?? ''} />

  if (error) return <ErrorMessage message={error.message} />
  const { permissions } = getAuthCredentials()
  let permission = hasAccess(adminOnly, permissions)

  return (
    <>
      {permission ? (
        <>
          <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
            <h1 className="text-lg font-semibold text-heading">
              {t('form:form-title-settings')}
            </h1>
          </div>

          <CreateOrUpdateSettingsForm initialValues={settings} />
        </>
      ) : (
        <DontView />
      )}
    </>
  )
}
Settings.Layout = AppLayout

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
})
