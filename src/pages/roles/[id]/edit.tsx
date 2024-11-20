import type { GetServerSideProps } from 'next'
import {
  adminOnly,
  allowedRoles,
  getAuthCredentials,
  hasAccess,
  isAuthenticated,
} from '@/utils/auth-utils'
import { Routes } from '@/config/routes'
import Layout from '@/components/layout/admin'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import DontView from '@/components/dontView/dont-view'
import CreateRol from '@/components/roles/create-rol'
import { useJobpositionByIdQuery } from '@/data/job-position'
import { useRouter } from 'next/router'

export default function CreateNotePage() {
  const { permissions } = getAuthCredentials()
  let permission = hasAccess(adminOnly, permissions)

  const router = useRouter()
  const {
    query: { id },
  } = router

  const { jobposition } = useJobpositionByIdQuery({
    id: id as string,
  })

  return (
    <>
      {permission ? (
        <>
          <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
            <h1 className="text-lg font-semibold text-heading">
              Editar posición de trabajo
            </h1>
          </div>
          <CreateRol initialValues={jobposition} />
        </>
      ) : (
        <DontView />
      )}
    </>
  )
}

CreateNotePage.Layout = Layout

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
