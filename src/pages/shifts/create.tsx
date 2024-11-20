import {useTranslation} from 'react-i18next'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations'

import Layout from '@/components/layout/admin'
import CreateOrUpdateShiftForm from '@/components/shifts/shift-form'
import {
  getAuthCredentials,
  hasAccess,
  adminOnly,
  allowedRoles,
  isAuthenticated,
} from '@/utils/auth-utils'
import DontView from '@/components/dontView/dont-view'
import {Routes} from '@/config/routes'
import {GetServerSideProps} from 'next'

const {permissions} = getAuthCredentials()
const permission = hasAccess(adminOnly,permissions)

export default function CreateShift() {
  const {t} = useTranslation()

  return (
    <>
      {permission ? (
        <>
          <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
            <h1 className="text-lg font-semibold text-heading">
              {t('form:create-shifts-label')}
            </h1>
          </div>

          <CreateOrUpdateShiftForm />
        </>
      ) : (
        <DontView />
      )}
    </>
  )
}

CreateShift.Layout = Layout

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const {token,permissions} = getAuthCredentials(ctx)
  const locale = ctx.locale || 'es'
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
      ...(await serverSideTranslations(locale,['table','common','form'])),
    },
  }
}
