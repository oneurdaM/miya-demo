import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import Card from '@/components/common/card'
import Layout from '@/components/layout/admin'
import ErrorMessage from '@/components/ui/error-message'
import Loader from '@/components/ui/loader/loader'
import { SortOrder } from '@/types'
import Search from '@/components/common/search'
import LinkButton from '@/components/ui/link-button'
import NoticeList from '@/components/notice/notice-list'
import { useStoreNoticesQuery } from '@/data/store-notice'
import { Routes } from '@/config/routes'
import {
  getAuthCredentials,
  hasAccess,
  adminOnly,
  allowedRoles,
  isAuthenticated,
} from '@/utils/auth-utils'
import { GetServerSideProps } from 'next'

export default function Notices() {
  const { t } = useTranslation()
  const [orderBy, setOrder] = useState('createdAt')
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc)
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const { storeNotices, loading, paginatorInfo, error } = useStoreNoticesQuery({
    limit: 5,
    page,
    notice: searchTerm,
    orderBy,
    sortedBy,
  })

  if (loading) return <Loader text={t('common:text-loading') ?? 'Loading...'} />
  if (error) return <ErrorMessage message={error.message} />

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText)
    setPage(1)
  }

  function handlePagination(current: number) {
    setPage(current)
  }

  const { permissions } = getAuthCredentials()
  let permission = hasAccess(adminOnly, permissions)

  return (
    <>
      <Card className="mb-8 flex flex-col items-center md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <h1 className="text-xl font-semibold text-heading">
            {t('form:input-label-store-notices')}
          </h1>
        </div>

        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:w-2/3 md:flex-row md:space-y-0 xl:w-3/4 2xl:w-1/2">
          <Search onSearch={handleSearch} />

          {permission ? (
            <LinkButton
              href={Routes.storeNotice.create}
              className="h-12 w-full md:w-auto md:ms-6  rounded-md"
            >
              <span className="hidden xl:block">
                + {t('form:button-label-add-store-notice')}
              </span>
              <span className="xl:hidden">+ {t('form:button-label-add')}</span>
            </LinkButton>
          ) : null}
        </div>
      </Card>

      <NoticeList
        notices={storeNotices}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  )
}

Notices.Layout = Layout

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
