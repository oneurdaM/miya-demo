import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import ErrorMessage from '@/components/ui/error-message'
import Layout from '@/components/layout/admin'
import Loader from '@/components/ui/loader/loader'
import CreateOrUpdateNoticeForm from '@/components/notice/notice-form'

import { useStoreNoticeQuery } from '@/data/store-notice'
import { Routes } from '@/config/routes'
import {
  getAuthCredentials,
  isAuthenticated,
  hasAccess,
  allowedRoles,
} from '@/utils/auth-utils'
import { GetServerSideProps } from 'next'

export default function UpdateNoticePage() {
  const { query } = useRouter()
  const { t } = useTranslation()
  const { storeNotice, loading, error } = useStoreNoticeQuery({
    id: query.id as string,
  })

  if (loading) return <Loader text={t('common:text-loading') ?? 'Loading...'} />
  if (error) return <ErrorMessage message={error.message} />
  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('form:form-title-edit-store-notice')}
        </h1>
      </div>
      <CreateOrUpdateNoticeForm initialValues={storeNotice} />
    </>
  )
}

UpdateNoticePage.Layout = Layout

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token, permissions } = getAuthCredentials(ctx)
  const locale = ctx.locale || 'es'
  if (
    !isAuthenticated({ token, permissions }) ||
    !hasAccess(allowedRoles, permissions)
  ) {
    return {
      redirect: {
        destination: Routes.login,
        permanent: false,
      },
    }
  }
  return {
    props: {
      userPermissions: permissions,
      ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
    },
  }
}
