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
import { useRoundsquery } from '@/data/round'
import RoundTable from '@/components/round/round-table'
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

  interface Data {
    label: string
    value: string
  }

  const { rounds, loading, error, paginatorInfo } = useRoundsquery({
    limit: 10,
    page,
    search: searchTerm,
  })

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText)
    // setPage(1)
  }

  const { permissions } = getAuthCredentials()
  let permission = hasAccess(adminOnly, permissions)

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

  function handlefilter(option: Data) {
    if (option !== null) {
      setSearchTerm(option.value)
    } else {
      setSearchTerm('')
    }
  }

  if (loading) return <Loader text="Cargando..." />

  if (error) return <ErrorMessage message={error.message} />

  return (
    <>
      <Card className="mb-8 flex flex-col items-center justify-between w-full md:flex-row">
        <div className="mb-4 md:mb-0 md:w-3/4">
          <PageHeading title={t('text-Round')} />
        </div>

        <div className="flex w-full gap-6  flex-col items-center  md:w-full  md:flex-row md:space-y-0 md:ms-auto xl:w-full">
          <div className="w-full flex justify-end gap-3">
            <Select
              isClearable
              className=" md:w-1/2 w-full "
              placeholder={'Estatus'}
              options={[
                {
                  label: 'En pogreso',
                  value: 'IN_PROGRESS',
                },
                {
                  label: 'Activo',
                  value: 'ACTIVE',
                },
                {
                  label: 'Verificado',
                  value: 'VERIFIED',
                },
                {
                  label: 'Completado',
                  value: 'COMPLETED',
                },
              ]}
              //@ts-ignore
              onChange={handlefilter}
            ></Select>
          </div>

          {/* <Search onSearch={handleSearch} /> */}

          {permission ? (
            <LinkButton
              href={`${Routes.Rondines.create}`}
              className="h-12 w-full rounded-md md:w-auto"
            >
              <span>+ {t('form:button-label-add-round')}</span>
            </LinkButton>
          ) : null}

          <div className="border-2 py-2 px-3 rounded-full mb-4 md:mb-0 flex justify-center">
            <CSVLink data={rounds} filename={`export-${today}.csv`}>
              <CsvIcon width={30} />
            </CSVLink>
          </div>
        </div>
      </Card>

      <RoundTable
        rounds={rounds}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
      />

      {/* <UserList
        users={userFilter.length === 0 ? users : userFilter}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
      /> */}
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
