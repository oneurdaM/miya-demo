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
import Card from '@/components/common/card'
import ControlTable from '@/components/ui/control-table'
import ControlTableHistory from '@/components/ui/control-table-history'
import { CSVLink } from 'react-csv'
import { CsvIcon } from '@/components/icons/csv-icon'
import LinkButton from '@/components/ui/link-button'
import Clock from '@/components/ui/clock'
import Select from '@/components/select/select'
import { DatePicker } from '@/components/ui/date-picker'
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
  const [searchTerm, setSearchTerm] = useState('')

  const { documents, loading, error, paginatorInfo } = userDocumentsQuery({
    // limit: 5,
    // page: page,
    // search: searchTerm,
  })

  function handlePagination(current: number) {
    setPage(current)
  }

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText)
    setPage(1)
  }

  if (loading) return <Loader />

  if (error) return <ErrorMessage message={error.message} />

  return (
    <>
      <div className="mb-10 lg:w-full flex-wrap space-y-6 ">
        <div className="col-span-full rounded-lg bg-light p-6 md:p-7">
          <div className="mb-5 flex items-center justify-between md:mb-7">
            <h3 className="before:content-'' relative mt-1 bg-light text-lg font-semibold text-heading before:absolute before:-top-px before:h-7 before:w-1 before:rounded-tr-md before:rounded-br-md before:bg-accent ltr:before:-left-6 rtl:before:-right-6 md:before:-top-0.5 md:ltr:before:-left-7 md:rtl:before:-right-7 lg:before:h-8">
              {t('text-history-label')}
            </h3>
          </div>
          <div className="flex  items-center">
            <div className="flex justify-between px-5 py-2  w-1/2 items-center mr-2">
              <DatePicker
                onChange={() => {}}
                selectsEnd
                placeholderText="Select Date"
              />
            </div>

            <Select
              isClearable={true}
              options={[
                {
                  label: 'Matutino',
                  value: 1,
                },
                {
                  label: 'Vespertino',
                  value: 2,
                },
                {
                  label: 'Nocturno',
                  value: 3,
                },
              ]}
              className="w-1/2 mx-2"
              // onChange={(e: any) => {
              //   handleChangeFilter(e)
              // }}
              getOptionLabel={(option: any) => `${t(option.label)}`}
              placeholder={'Selecciona Turno'}
            />

            <Select
              isClearable={true}
              options={[
                {
                  label: 'Matutino',
                  value: 1,
                },
                {
                  label: 'Vespertino',
                  value: 2,
                },
                {
                  label: 'Nocturno',
                  value: 3,
                },
              ]}
              className="w-1/2 mx-2"
              // onChange={(e: any) => {
              //   handleChangeFilter(e)
              // }}
              getOptionLabel={(option: any) => `${t(option.label)}`}
              placeholder={'Selecciona Turno'}
            />
            <div className="mx-5 border-2 py-2 pl-3 pr-2 rounded-full">
              <CSVLink data={[]} filename={`export-$.csv`}>
                <CsvIcon width={30} />
              </CSVLink>
            </div>
          </div>
        </div>
        <Card className="mb-6 w-full xl:mb-0">
          <ControlTableHistory
            documentos={[]}
            title={t('text-history-table')}
          />
        </Card>
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
