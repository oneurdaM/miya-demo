import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { CSVLink } from 'react-csv'
import Layout from '@/components/layout/admin'
import Card from '@/components/common/card'
import Search from '@/components/common/search'
import LinkButton from '@/components/ui/link-button'
import { Routes } from '@/config/routes'
import { useUsersQuery } from '@/data/users'
import Loader from '@/components/ui/loader/loader'
import ErrorMessage from '@/components/ui/error-message'
import UserList from '@/components/user/user-list'
import PageHeading from '@/components/common/page-heading'
import { CsvIcon } from '@/components/icons/csv-icon'
import Select from '@/components/ui/select/select'
import { UsersResponse } from '@/types/users'
import { useRouter } from 'next/router'
import SectorTable from '@/components/sector/sector-table'
import { userSectorListQuery, userSectorQuery } from '@/data/analytics'
import {
  getAuthCredentials,
  hasAccess,
  adminOnly,
  allowedRoles,
  isAuthenticated,
} from '@/utils/auth-utils'
import { GetServerSideProps } from 'next'

export default function Users() {
  const { t } = useTranslation()
  const today = new Date().toISOString().split('T')[0]

  const [searchTerm, setSearchTerm] = useState('')
  const [searchJob, setSearchJob] = useState('')
  const [page, setPage] = useState(1)
  const [userFilter, _setUserFilter] = useState<UsersResponse[]>([])

  const { sector, loading, error, paginatorInfo } = userSectorListQuery({
    limit: 10,
    page,
    search: searchTerm,
  })

  const router = useRouter()

  if (loading) return <Loader text="Cargando usuarios..." />

  if (error) return <ErrorMessage message={error.message} />

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText)
    setPage(1)
  }

  function handlePagination(current: number) {
    setPage(current)
  }

  function handleChangeFilter(value: any) {
    if (value) {
      setSearchJob(value.value)
    } else {
      setSearchJob('')
    }
  }

  if (loading) return <Loader />

  const { permissions } = getAuthCredentials()
  let permission = hasAccess(adminOnly, permissions)

  return (
    <>
      <Card className="mb-8 flex flex-col items-center md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <PageHeading title={t('form:input-label-sector')} />
        </div>

        <div className="flex w-full flex-col items-center space-y-4 md:w-3/4 md:flex-row md:space-y-0 md:ms-auto xl:w-full">
          <Search onSearch={handleSearch} />

          {/* <div className="mx-5 border-2 py-2 pl-3 pr-2 rounded-full">
           <CSVLink data={data} filename={`export-${today}.csv`}>
              <CsvIcon width={30} />
            </CSVLink> 
          </div> */}

          {permission ? (
            <LinkButton
              href={`${Routes.sectores.create}`}
              className="h-12 w-full md:w-auto md:ms-6 rounded-md"
            >
              <span>+ {t('form:button-label-add-sector')}</span>
            </LinkButton>
          ) : null}
        </div>
      </Card>

      <SectorTable
        sector={sector}
        onPagination={handlePagination}
        paginatorInfo={paginatorInfo}
      />
    </>
  )
}

Users.Layout = Layout

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
