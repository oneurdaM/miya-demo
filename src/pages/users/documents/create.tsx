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
import { UsersResponse, userJobPosition } from '@/types/users'
import { useRouter } from 'next/router'
import DocumentoTableUser from '@/components/ui/document-table-user'
import {
  adminOnly,
  allowedRoles,
  getAuthCredentials,
  hasAccess,
  isAuthenticated,
} from '@/utils/auth-utils'
import DontView from '@/components/dontView/dont-view'
import { GetServerSideProps } from 'next'

export default function Users() {
  const { t } = useTranslation()
  const today = new Date().toISOString().split('T')[0]

  const [searchTerm, setSearchTerm] = useState('')
  const [searchJob, setSearchJob] = useState('')
  const [page, setPage] = useState(1)
  const [userFilter, setUserFilter] = useState<UsersResponse[]>([])

  const { users, loading, error, paginatorInfo } = useUsersQuery({
    limit: 5,
    page,
    search: searchTerm,
    jobPosition: searchJob,
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

  // const jobPositions = userJobPosition()

  const { permissions } = getAuthCredentials()
  let permission = hasAccess(adminOnly, permissions)

  return (
    <>
      {permission ? (
        <>
          <Card className="mb-8 flex flex-col md:flex-row">
            <div className="mb-4 md:mb-0 md:w-1/5 ">
              <PageHeading title={t('form:input-label-customers')} />
            </div>

            <div
              //   className="flex flex-col md:flex-row md:items-center md:justify-between  md:space-x-4 lg:justify-between "
              className="flex lg:w-full lg:justify-end flex-col md:flex-row md:items-center md:space-x-4 "
            >
              <div className="flex w-full md:w-2/3 lg:w-1/2 mb-4 md:mb-0">
                <Search onSearch={handleSearch} />
              </div>

              {/* <div className="flex flex-col md:flex-row md:items-center md:space-x-2">
                <div className="mb-4 md:mb-0 md:w-1/2 lg:w-[15em]">
                  <Select
                    isClearable={true}
                    options={jobPositions}
                    className="w-full"
                    onChange={(e: any) => handleChangeFilter(e)}
                    getOptionLabel={(option: any) => t(option.label)}
                    placeholder={t('form:input-select-placeholder') ?? ''}
                  />
                </div>
              </div> */}
            </div>
          </Card>

          <DocumentoTableUser
            users={userFilter.length === 0 ? users : userFilter}
            paginatorInfo={paginatorInfo}
            onPagination={handlePagination}
          />
        </>
      ) : (
        <DontView />
      )}
    </>
  )
}

Users.Layout = Layout

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
