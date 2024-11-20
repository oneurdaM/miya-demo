import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/layout/admin'
import { GetServerSideProps } from 'next'
import {
  adminOnly,
  allowedRoles,
  getAuthCredentials,
  hasAccess,
  isAuthenticated,
} from '@/utils/auth-utils'
import { Routes } from '@/config/routes'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import DontView from '@/components/dontView/dont-view'
import CheckpointCreate from '@/components/checkpoint/creaete-edit-checkpoint'

export default function UserPage() {
  const { t } = useTranslation()
  const { permissions } = getAuthCredentials()
  let permission = hasAccess(adminOnly, permissions)

  return (
    <>
      {permission ? (
        <>
          <CheckpointCreate />
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
