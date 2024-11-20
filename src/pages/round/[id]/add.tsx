import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/layout/admin'
import ErrorMessage from '@/components/ui/error-message'
import Loader from '@/components/ui/loader/loader'
import { useRoundQueryId } from '@/data/round'
import { GetServerSideProps } from 'next'
import {
  adminOnly,
  allowedRoles,
  getAuthCredentials,
  hasAccess,
  isAuthenticated,
} from '@/utils/auth-utils'
import { Routes } from '@/config/routes'
import DontView from '@/components/dontView/dont-view'
import AddUserToRound from '@/components/round/add-user-round'

export default function UserPage() {
  const router = useRouter()
  const {
    query: { id },
  } = router

  const { permissions } = getAuthCredentials()
  let permission = hasAccess(adminOnly, permissions)

  const { round, loading, error } = useRoundQueryId({
    id: Number(id),
  })

  if (loading) return <Loader />

  if (error) return <ErrorMessage message={error.message} />

  return (
    <>
      {permission ? (
        <>
          <div className="flex border-b border-dashed border-border-base py-5 sm:py-8">
            <h1 className="text-lg font-semibold text-heading">
              Agregar nuevos usuarios a la ronda
            </h1>
          </div>
          <AddUserToRound initialValues={round} />
        </>
      ) : (
        <DontView />
      )}
    </>
  )
}

UserPage.Layout = Layout

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
