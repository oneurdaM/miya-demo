import { useState } from 'react'

import Layout from '@/components/layout/admin'
import Card from '@/components/common/card'
import Search from '@/components/common/search'
import ErrorMessage from '@/components/ui/error-message'
import LinkButton from '@/components/ui/link-button'
import Loader from '@/components/ui/loader/loader'
import { Routes } from '@/config/routes'
import { useCategoryQuery } from '@/data/category'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import CategoryList from '@/components/category/category-list'
import {
  getAuthCredentials,
  hasAccess,
  adminOnly,
  allowedRoles,
  isAuthenticated,
} from '@/utils/auth-utils'
import { GetServerSideProps } from 'next'

export default function Categories() {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const { categories, loading, error, paginatorInfo } = useCategoryQuery({
    limit: 10,
    page,
    search: searchTerm,
  })
  if (loading) return <Loader text="Cargando categorías..." />

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
          <h1 className="text-lg font-semibold text-heading">Categorías</h1>
        </div>

        <div className="flex w-full items-center ms-auto md:w-3/4">
          <Search onSearch={handleSearch} />

          {permission ? (
            <LinkButton
              href={`${Routes.categories.create}`}
              className="h-12 ms-4 md:ms-6 rounded-md"
            >
              <span>+ Crear</span>
            </LinkButton>
          ) : null}
        </div>
      </Card>

      <CategoryList
        categories={categories ?? []}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
      />
    </>
  )
}

Categories.Layout = Layout

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
