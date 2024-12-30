import { useTranslation } from 'react-i18next'

import Layout from '@/components/layout/admin'
import Card from '@/components/common/card'
import LinkButton from '@/components/ui/link-button'
import { Routes } from '@/config/routes'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import ConferencesList from '@/components/conferences/conferences-list'
import {
  getAuthCredentials,
  isAuthenticated,
  hasAccess,
  allowedRoles,
} from '@/utils/auth-utils'
import { GetServerSideProps } from 'next'

export default function Conferences() {
  const { t } = useTranslation()

  return (
    <>
      <Card className="mb-8 flex flex-col items-center md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <h1 className="text-xl font-semibold text-heading">
            {t('form:form-label-conferences')}
          </h1>
        </div>
        <div className="flex w-full justify-end  items-center space-y-4 ms-auto md:w-2/3 md:flex-row md:space-y-0 xl:w-3/4 2xl:w-1/2">
          <LinkButton
            href={Routes.conferences.create}
            className="h-12 w-full md:w-auto md:ms-6  rounded-md"
          >
            <span className="hidden xl:block">
              + {t('form:button-label-host-conference')}
            </span>
            <span className="xl:hidden">+ {t('form:button-label-add')}</span>
          </LinkButton>
        </div>
      </Card>

      <ConferencesList
        conferences={[]}
        paginatorInfo={null}
        onPagination={() => {}}
        onSort={() => {}}
        onOrder={() => {}}
      />
    </>
  )
}

Conferences.Layout = Layout

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
