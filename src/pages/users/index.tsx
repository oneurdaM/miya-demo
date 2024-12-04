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
import {
  adminOnly,
  allowedRoles,
  getAuthCredentials,
  hasAccess,
  isAuthenticated,
} from '@/utils/auth-utils'
import { AvatarIcon } from '@/components/icons/avatar-icon'
import { capitalizeWords } from '@/utils/functions'
import { useJobPositionQuery } from '@/data/job-position'
import { GetServerSideProps } from 'next'

export default function Users() {
  const { t } = useTranslation()
  const today = new Date().toISOString().split('T')[0]

  const [searchTerm, setSearchTerm] = useState('')
  const [searchJob, setSearchJob] = useState('')
  const [page, setPage] = useState(1)
  const [userFilter, setUserFilter] = useState<UsersResponse[]>([])

  const { users, loading, error, paginatorInfo } = useUsersQuery({
    limit: 10,
    page,
    search: searchTerm,
    jobPosition: searchJob,
  })

  const { jobposition } = useJobPositionQuery()

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
  const { permissions } = getAuthCredentials()
  let permission = hasAccess(adminOnly, permissions)

  const formattedJobposition = Array.isArray(jobposition)
  ? jobposition.map((doc: any) => ({
      label: capitalizeWords(doc.name),
      value: doc.id,
    }))
  : [];

  function handleSelect(value: any) {
    if (value) {
      setSearchJob(value.value)
    } else {
      setSearchJob('')
    }
  }

  return (
    <>
      <Card className="mb-8 block flex-col md:flex-row">
        <div className="mb-4 lg:mb-6 md:mb-0  md:w-full lg:flex block lg:justify-between items-center lg:w-full ">
          <div>
            <PageHeading title={t('form:input-label-customers')} />
          </div>

        
          {/* <div className="md:flex lg:flex gap-3 justify-between mb-4 sm:block">
            {permission === true ? (
              <LinkButton
                href={Routes.users.create}
                className="h-12 w-full md:w-1/2 rounded-md mb-4 md:mb-0"
              >
                <span className="flex">
                  + <AvatarIcon />
                </span>
              </LinkButton>
            ) : null}

            <LinkButton
              href={`${router.asPath}/documents`}
              className="h-12 w-full md:w-1/2  rounded-md bg-slate-500"
            >
              <span>{t('form:button-label-document-show')}</span>
            </LinkButton>
          </div> */}
        </div>

        <div className="lg:flex block md:flex md:flex-row md:items-center md:justify-between  md:space-x-4">
          <div className="flex w-full md:w-2/3 lg:w-1/2 mb-4 md:mb-0">
            <Search onSearch={handleSearch} />
          </div>

          <div className="mb-4 md:mb-0 md:w-1/2 flex gap-3">
            <Select
              getOptionValue={(option: any) => option.value}
              getOptionLabel={(option: any) => option.label}
              options={formattedJobposition ?? []}
              isMulti={false}
              className="w-full"
              isClearable
              onChange={handleSelect}
            />

            {permission === true ? (
              <LinkButton
                href={Routes.users.create}
                className=" rounded-md mb-4 md:mb-0"
              >
                <span className="flex">
                  + Agregar usuario
                </span>
              </LinkButton>
            ) : null}

            {users.length > 0 && (
              <div className="border-2 py-2 px-3 rounded-full mb-4 md:mb-0 flex justify-center">
                <CSVLink data={users} filename={`export-${today}.csv`}>
                  <CsvIcon width={30} />
                </CSVLink>
              </div>
            )}
          </div>
        </div>
      </Card>

      <UserList
        users={userFilter.length === 0 ? users : userFilter}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
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
