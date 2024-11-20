import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/layout/admin'
import ErrorMessage from '@/components/ui/error-message'
import Loader from '@/components/ui/loader/loader'
import PageHeading from '@/components/common/page-heading'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import LinkButton from '@/components/ui/link-button'
import Card from '@/components/common/card'
import { Routes } from '@/config/routes'
import { useJobPositionQuery } from '@/data/job-position'
import RoleTable from '@/components/roles/role-table'
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

  const { jobposition, loading, error, paginatorInfo } = useJobPositionQuery({
    limit: 5,
    page: page,
    search: searchTerm,
  })

  function handlePagination(current: number) {
    setPage(current)
  }

  if (loading) return <Loader />

  if (error) return <ErrorMessage message={error.message} />

  return (
    <>
      <Card className=" block flex-col md:flex-row mb-5">
        <div className=" flex w-full flex-wrap space-y-6 justify-between items-center">
          <div className="md:mb-0 md:w-full lg:flex block lg:justify-between items-center lg:w-full ">
            <div>
              <PageHeading title={t('form:input-label-jobposition')} />
            </div>

            <div className="md:flex lg:flex gap-3 justify-between mb-4 sm:block">
              <LinkButton
                href={Routes.roles.create}
                className="  rounded-md mb-4 md:mb-0"
              >
                <span className="flex">+ Agregar Rol</span>
              </LinkButton>
            </div>
          </div>
        </div>
      </Card>

      <div className="w-full">
        {
          <RoleTable
            data={jobposition}
            //   paginatorInfo={paginatorInfo}
            //   onPagination={handlePagination}
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
