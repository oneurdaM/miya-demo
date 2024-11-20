import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import ProfileUpdateOrCreateForm from '@/components/auth/profile-update-or-create-form'
import AlertListSmall from '@/components/alert/alert-list-small'
import Layout from '@/components/layout/admin'
import ChatTable from '@/components/ui/chat-table'
import ErrorMessage from '@/components/ui/error-message'
import Loader from '@/components/ui/loader/loader'
import { useUserQuery, userDocumentByIdQuery } from '@/data/user'
import DocumentTable from '@/components/ui/document-table-by-user'
import PageHeading from '@/components/common/page-heading'
import { useTranslation } from 'react-i18next'
import { userDocumentsQuery } from '@/data/users'
import { useState } from 'react'
import { Routes } from '@/config/routes'
import {
  getAuthCredentials,
  isAuthenticated,
  hasAccess,
  allowedRoles,
} from '@/utils/auth-utils'
import { GetServerSideProps } from 'next'

export default function UserPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const {
    query: { id },
  } = router
  const [page, setPage] = useState(1)

  const { documents, loading, error, paginatorInfo } = userDocumentByIdQuery({
    id: String(id),
    page: page,
    limit: 10,
  })
  function handlePagination(current: number) {
    setPage(current)
  }

  if (loading) return <Loader />

  if (error) return <ErrorMessage message={error.message} />

  return (
    <>
      <div className="mb-10 flex w-full flex-wrap space-y-6 ">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <PageHeading title={t('form:input-label-documents')} />
        </div>
        <div className="w-full">
          {
            <DocumentTable
              title="Documentos"
              documentos={documents || []}
              paginatorInfo={paginatorInfo}
              onPagination={handlePagination}
            />
          }
        </div>
      </div>
    </>
  )
}

UserPage.Layout = Layout

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
