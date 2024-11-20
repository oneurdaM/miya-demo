import type {GetServerSideProps} from 'next'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations'

import Layout from '@/components/layout/admin'
import MessagePageIndex from '@/components/message/index'
import {Routes} from '@/config/routes'
import {
  getAuthCredentials,
  isAuthenticated,
  hasAccess,
  allowedRoles,
} from '@/utils/auth-utils'

export default function MessagePage() {
  return (
    <>
      <MessagePageIndex />
    </>
  )
}

MessagePage.Layout = Layout

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
