import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/layout/admin'
import ErrorMessage from '@/components/ui/error-message'
import Loader from '@/components/ui/loader/loader'
import PageHeading from '@/components/common/page-heading'
import { useTranslation } from 'react-i18next'
import DocumentTableRol from '@/components/roles/document-table-rol'
import { useobPositionByIdQuery } from '@/data/job-position'
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

  const { jobPosition, loading, error } = useobPositionByIdQuery({
    id: id as string,
  })

  if (loading) return <Loader />

  if (error) return <ErrorMessage message={error.message} />

  return (
    <>
      <div className="mb-10 flex w-full flex-wrap space-y-6 ">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <PageHeading title={'Documentos por rol'} />
        </div>
        <div className="w-full">
          {
            <DocumentTableRol
              title="Documentos"
              //@ts-ignore
              documentos={jobPosition?.requireDocuments || []}
            />
          }
        </div>
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
