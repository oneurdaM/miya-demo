import {useRouter} from 'next/router'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations'

import Layout from '@/components/layout/admin'
import ErrorMessage from '@/components/ui/error-message'
import Loader from '@/components/ui/loader/loader'
import {useShiftByIdQuery} from '@/data/shift'
import {useTranslation} from 'react-i18next'
import {GetServerSideProps} from 'next'
import {
  adminOnly,
  allowedRoles,
  getAuthCredentials,
  hasAccess,
  isAuthenticated,
} from '@/utils/auth-utils'
import {Routes} from '@/config/routes'
import CreateOrUpdateShiftForm from '@/components/shifts/shift-form'
import DontView from '@/components/dontView/dont-view'

export default function ShiftPage() {
  const router = useRouter()
  const {
    query: {id},
  } = router
  const {t} = useTranslation()
  const {shift,loading,error} = useShiftByIdQuery({
    id: Number(id),
  })

  const {permissions} = getAuthCredentials()
  const permission = hasAccess(adminOnly,permissions)

  if (loading) return <Loader />

  if (error) return <ErrorMessage message={error.message} />

  return (
    <>
      {permission ? (
        <>
          <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
            <h1 className="text-lg font-semibold text-heading">
              {t('form:create-shifts-label')}
            </h1>
          </div>
          <CreateOrUpdateShiftForm initialValues={shift} />
        </>
      ) : (
        <DontView />
      )}
    </>
  )
}

ShiftPage.Layout = Layout

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {token,permissions} = getAuthCredentials(ctx)
  if (
    !isAuthenticated({token,permissions}) ||
    !hasAccess(allowedRoles,permissions)
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
      ...(await serverSideTranslations(ctx.locale ?? 'es',[
        'table',
        'common',
        'form',
      ])),
    },
  }
}
