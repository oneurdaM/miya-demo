import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import ProfileUpdateOrCreateForm from '@/components/auth/profile-update-or-create-form'
import AlertListSmall from '@/components/alert/alert-list-small'
import Layout from '@/components/layout/admin'
import ChatTable from '@/components/ui/chat-table'
import ErrorMessage from '@/components/ui/error-message'
import Loader from '@/components/ui/loader/loader'
import { useUserQuery, userDocumentByIdQuery } from '@/data/user'
import DocumentTable from '@/components/ui/document-table'
import PageHeading from '@/components/common/page-heading'
import { useTranslation } from 'react-i18next'
import { userDocumentsQuery } from '@/data/users'
import { useState } from 'react'
import Search from '@/components/common/search'
import LinkButton from '@/components/ui/link-button'
import {
  adminOnly,
  allowedRoles,
  getAuthCredentials,
  hasAccess,
  isAuthenticated,
} from '@/utils/auth-utils'
import { Routes } from '@/config/routes'
import { GetServerSideProps } from 'next'

export default function UserPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const {
    query: { id },
  } = router

  const { permissions } = getAuthCredentials()
  let permission = hasAccess(adminOnly, permissions)

  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  const { documents, loading, error, paginatorInfo } = userDocumentsQuery({
    limit: 1000,
    page: page,
    // search: '',
  })

  function handlePagination(current: number) {
    setPage(current)
  }

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText)
    setPage(1)
  }

  const filteredDocuments = documents.filter((document: { name: string }) =>
    document.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <Loader />

  if (error) return <ErrorMessage message={error.message} />

  return (
    <>
      <div className="mb-10 flex w-full flex-wrap space-y-6 items-center ">
        <div className="mb-4 md:mb-0 md:w-full">
          <PageHeading title={t('form:input-label-documents')} />
        </div>
        <div className="flex w-full gap-3">
          <div className="flex w-full flex-col items-center space-y-4 md:w-3/4 md:flex-row md:space-y-0 md:ms-auto xl:w-1/2">
            <Search onSearch={handleSearch} />
          </div>

          {permission ? (
            <>
              <div>
                <LinkButton
                  href={`${router.asPath}/create`}
                  className="h-12 w-full md:w-auto rounded-md bg-stone-800"
                >
                  <span>+</span>
                </LinkButton>
              </div>
            </>
          ) : null}
        </div>
      </div>
      <div className="w-full">
        {
          <DocumentTable
            title="Documentos"
            documents={searchTerm.length === 0 ? documents : filteredDocuments}
            paginatorInfo={paginatorInfo}
            onPagination={handlePagination}
          />
        }
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
