import { GetServerSideProps } from 'next'
import { useTranslation } from 'react-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  adminOnly,
  allowedRoles,
  getAuthCredentials,
  hasAccess,
  isAuthenticated,
} from '@/utils/auth-utils'
import { Routes } from '@/config/routes'

import Layout from '@/components/layout/admin'
import CreateRound from '@/components/round/create-round'
import { useState } from 'react'
import { useUsersQuery } from '@/data/users'
import Loader from '@/components/ui/loader/loader'
import ErrorMessage from '@/components/ui/error-message'
import DontView from '@/components/dontView/dont-view'

export default function CreateRoundPage() {
  const { t } = useTranslation()
  const { permissions } = getAuthCredentials()
  let permission = hasAccess(adminOnly, permissions)

  const [searchTerm, setSearchTerm] = useState('')
  const [searchJob, setSearchJob] = useState('')
  const [page, setPage] = useState(1)

  const { users, loading, error } = useUsersQuery({
    limit: 100,
    page,
    search: searchTerm,
    jobPosition: searchJob,
  })

  if (loading) return <Loader text="Cargando..." />

  if (error) return <ErrorMessage message={error.message} />

  return (
    <>
      {permission ? (
        <>
          <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
            <h1 className="text-lg font-semibold text-heading">
              {t('form:form-create-round')}
            </h1>
          </div>
          <CreateRound users={users} />
        </>
      ) : (
        <DontView />
      )}
    </>
  )
}

CreateRoundPage.Layout = Layout

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token, permissions } = getAuthCredentials(ctx)
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
      ...(await serverSideTranslations(ctx.locale ?? 'es', [
        'table',
        'common',
        'form',
      ])),
    },
  }
}
