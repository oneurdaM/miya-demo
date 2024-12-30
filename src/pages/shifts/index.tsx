import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Card from '@/components/common/card'
import Layout from '@/components/layout/admin'
import PageHeading from '@/components/common/page-heading'
import Search from '@/components/common/search'
import LinkButton from '@/components/ui/link-button'
import { Routes } from '@/config/routes'
import { useShiftQuery } from '@/data/shift'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Loader from '@/components/ui/loader/loader'
import ShiftsList from '@/components/shifts/shifts-list'
import {
  getAuthCredentials,
  hasAccess,
  adminOnly,
  allowedRoles,
  isAuthenticated,
} from '@/utils/auth-utils'
import { GetServerSideProps } from 'next'

export default function Shifts() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const { shifts, loading, paginatorInfo } = useShiftQuery({
    limit: 20,
    page,
    search: searchTerm,
  })

  const { permissions } = getAuthCredentials()
  let permission = hasAccess(adminOnly, permissions)

  if (loading) return <Loader text={t('common:text-loading') ?? ''} />

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText)
    setPage(1)
  }

  function handlePagination(current: number) {
    setPage(current)
  }

  return (
    <>
      <Card className="mb-8 flex flex-col items-center md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <PageHeading title={t('form:input-label-shifts')} />
        </div>
        <div className="flex w-full flex-col items-center space-y-4 md:w-3/4 md:flex-row md:space-y-0 md:ms-auto xl:w-1/2">
          <Search onSearch={handleSearch} />

          {permission ? (
            <LinkButton
              href={`${Routes.shifts.create}`}
              className="h-12 w-full md:w-auto md:ms-6 rounded-md"
            >
              <span>+ {t('form:button-label-add-shift')}</span>
            </LinkButton>
          ) : null}
        </div>
      </Card>

      {loading ? null : (
        <ShiftsList
          shifts={shifts ?? []}
          paginatorInfo={paginatorInfo}
          onPagination={handlePagination}
        />
      )}
    </>
  )
}

Shifts.Layout = Layout

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
