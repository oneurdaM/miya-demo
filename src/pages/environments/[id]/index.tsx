import AppLayout from '@/components/layout/app'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetServerSideProps, GetStaticPaths } from 'next'
import CreateOrUpdateEnvironment from '@/components/environments/environment-form'
import { useGetEnvironment } from '@/data/enviroment'
import { useRouter } from 'next/router'
import Loader from '@/components/ui/loader/loader'
import ErrorMessage from '@/components/ui/error-message'
import { Routes } from '@/config/routes'
import {
  getAuthCredentials,
  isAuthenticated,
  hasAccess,
  allowedRoles,
} from '@/utils/auth-utils'

export default function EnvironmentDetail() {
  const router = useRouter()
  const {
    query: { id },
  } = router
  const { data, error, loading } = useGetEnvironment({
    id: id?.toString() ?? '',
  })

  if (loading) return <Loader text="Cargando entorno..." />

  if (error) return <ErrorMessage message={error.message} />

  return (
    <>
      <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          Actualiza el entorno
        </h1>
      </div>
      <CreateOrUpdateEnvironment initialValues={data} />
    </>
  )
}

EnvironmentDetail.Layout = AppLayout

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
