import Card from '@/components/common/card'
import Layout from '@/components/layout/admin'
import ErrorMessage from '@/components/ui/error-message'
import Loader from '@/components/ui/loader/loader'
import { SortOrder } from '@/types'
import {
  allowedRoles,
  getAuthCredentials,
  hasAccess,
  isAuthenticated,
} from '@/utils/auth-utils'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useState } from 'react'
import PageHeading from '@/components/common/page-heading'
import AdminsList from '@/components/user/user-admin-list'
import { useAdminsQuery } from '@/data/users'
import { Routes } from '@/config/routes'
import { GetServerSideProps } from 'next'
export default function Admins() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [orderBy, setOrder] = useState('created_at')
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc)

  const { users, paginatorInfo, loading, error } = useAdminsQuery({
    limit: 10,
    page,
    search: searchTerm,
  })

  if (loading) return <Loader text={t('common:text-loading') ?? ''} />
  if (error) return <ErrorMessage message={error.message} />

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText)
    setPage(1)
  }

  function handlePagination(current: any) {
    setPage(current)
  }

  return (
    <>
      <Card className="mb-8 flex items-center">
        <div className="md:w-1/4">
          <PageHeading title={t('table:text-admins')} />
        </div>
      </Card>

      {loading ? null : (
        <AdminsList
          admins={users}
          paginatorInfo={paginatorInfo}
          onPagination={handlePagination}
          onOrder={setOrder}
          onSort={setColumn}
        />
      )}
    </>
  )
}

// Admins.authenticate = {
// 	permissions: adminOnly,
// };

Admins.Layout = Layout

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
