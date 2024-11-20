import { GetServerSideProps } from 'next'
import { useTranslation } from 'react-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import {
  adminOnly,
  allowedRoles,
  getAuthCredentials,
  hasAccess,
  isAuthenticated,
} from '@/utils/auth-utils'
import { Routes } from '@/config/routes'

import Layout from '@/components/layout/admin'
import ProfileUpdateOrCreateForm from '@/components/auth/profile-update-or-create-form'
import { userSectorListQuery } from '@/data/analytics'
import { useShiftQuery } from '@/data/shift'
import { WarningUser } from '@/components/warning/warningUser'
import DontView from '@/components/dontView/dont-view'

export default function CreateUser() {
  const { t } = useTranslation()
  const { permissions } = getAuthCredentials()
  let permission = hasAccess(adminOnly, permissions)

  const { shifts, loading: loadingShifts } = useShiftQuery({
    limit: 10,
    page: 1,
  })

  const { sector } = userSectorListQuery({
    limit: 10,
    page: 1,
  })

  return (
    <>
      {permission ? (
        <>
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:absolute top-0 left-0 md:w-1/2 w-full p-2">
              {sector && sector.length < 1 ? (
                <WarningUser
                  text={'Es necesario agregar sectores'}
                  route={'../sector'}
                />
              ) : null}
            </div>
            <div className="md:absolute top-0 right-0 md:w-1/2 w-full p-2">
              {shifts && shifts.length < 1 ? (
                <WarningUser
                  text={'Es necesario agregar horarios'}
                  route={'../shifts'}
                />
              ) : null}
            </div>
          </div>

          <div className=" mt-14 flex border-b border-dashed border-border-base py-5 sm:py-8">
            <h1 className="text-lg font-semibold text-heading">
              {t('form:form-create-user')}
            </h1>
          </div>

          <ProfileUpdateOrCreateForm />
        </>
      ) : (
        <DontView />
      )}
    </>
  )
}

CreateUser.Layout = Layout

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
