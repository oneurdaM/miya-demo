import Layout from '@/components/layout/admin'
import SuggestionDetailView from '@/components/suggestions/suggestion-detail-view'
import ErrorMessage from '@/components/ui/error-message'
import Loader from '@/components/ui/loader/loader'
import { Routes } from '@/config/routes'
import { useReviewsQuery } from '@/data/suggestions'
import {
  getAuthCredentials,
  isAuthenticated,
  hasAccess,
  allowedRoles,
} from '@/utils/auth-utils'
import { GetServerSideProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

export default function SuggestionPage() {
  const { query } = useRouter()
  const { t } = useTranslation()

  const {
    data,
    isLoading: loading,
    error,
  } = useReviewsQuery(query.id as string)
  if (loading) return <Loader text={t('common:text-loading') ?? ''} />
  if (error) return <ErrorMessage message={error.message} />

  return <SuggestionDetailView suggestion={data!} />
}
SuggestionPage.Layout = Layout

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
