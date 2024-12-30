// import { useState } from 'react'
// import { useTranslation } from 'react-i18next'
// import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

// import Card from '@/components/common/card'
// import Layout from '@/components/layout/admin'
// import SuggestionList from '@/components/suggestions/suggestions-list'
// import Loader from '@/components/ui/loader/loader'
// import Search from '@/components/common/search'
// import ErrorMessage from '@/components/ui/error-message'
// import { useSuggestionQuery } from '@/data/suggestions'
// import LinkButton from '@/components/ui/link-button'
// import { Routes } from '@/config/routes'

// export default function Suggestions() {
//   const { t } = useTranslation()
//   const [searchTerm, setSearchTerm] = useState('')
//   const [page, setPage] = useState(1)
//   const { suggestions, loading, error, paginatorInfo } = useSuggestionQuery({
//     limit: 5,
//     page,
//     // search: searchTerm,
//   })

//   if (loading) return <Loader text="Cargando usuarios..." />

//   if (error) return <ErrorMessage message={error.message} />

//   function handleSearch({ searchText }: { searchText: string }) {
//     setSearchTerm(searchText)
//     setPage(1)
//   }

//   function handlePagination(current: number) {
//     setPage(current)
//   }

//   return (
//     <>
//       <Card className="mb-8 flex flex-col">
//         <div className="flex w-full flex-col items-center md:flex-row">
//           <h1 className="text-xl font-semibold text-heading">Sugerencias</h1>
//         </div>

//         <div className="flex w-full items-center ms-auto md:w-3/4">
//           {/* <Search onSearch={handleSearch} /> */}
//           {/* <LinkButton
//             href={`${Routes.suggestions.create}`}
//             className="h-12 w-full md:w-auto md:ms-6 rounded-md"
//           >
//             <span>+ {t('form:button-label-add-sugestion')}</span>
//           </LinkButton> */}
//         </div>
//       </Card>
//       {loading ? null : (
//         <SuggestionList
//           suggestions={suggestions ?? []}
//           paginatorInfo={paginatorInfo}
//           onPagination={handlePagination}
//         />
//       )}
//     </>
//   )
// }

// Suggestions.Layout = Layout

// export const getStaticProps = async ({ locale }: any) => ({
//   props: {
//     ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
//   },
// })

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import Card from '@/components/common/card'
import Layout from '@/components/layout/admin'
import Search from '@/components/common/search'
import LinkButton from '@/components/ui/link-button'
import { useEnviromentQuery } from '@/data/enviroment'
import EnviromentList from '@/components/environments/environment-list'
import Loader from '@/components/ui/loader/loader'
import ErrorMessage from '@/components/ui/error-message'
import { Routes } from '@/config/routes'
import { useSuggestionQuery } from '@/data/suggestions'
import SuggestionList from '@/components/suggestions/suggestions-list'
import {
  getAuthCredentials,
  hasAccess,
  adminOnly,
  allowedRoles,
  isAuthenticated,
} from '@/utils/auth-utils'
import { GetServerSideProps } from 'next'

export default function Suggestions() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const { suggestions, loading, error, paginatorInfo } = useSuggestionQuery({
    limit: 5,
    page,
    // search: searchTerm,
  })
  if (loading) return <Loader text="Cargando enviroments..." />

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
            {t('form:input-label-environments')}
          </h1>
        </div>
        <div className="flex w-full flex-col items-center space-y-4 ms-auto md:w-2/3 md:flex-row md:space-y-0 xl:w-3/4 2xl:w-1/2">
          <Search onSearch={handleSearch} />

          {permission ? (
            <LinkButton
              href={Routes.environments.create}
              className="h-12 w-full md:w-auto md:ms-6 rounded-md"
            >
              <span className="hidden xl:block">
                + {t('form:button-label-add-environment')}
              </span>
              <span className="xl:hidden">+ {t('form:button-label-add')}</span>
            </LinkButton>
          ) : null}
        </div>
      </Card>

      {loading ? null : (
        <SuggestionList
          suggestions={suggestions ?? []}
          paginatorInfo={paginatorInfo}
          onPagination={handlePagination}
        />
      )}
    </>
  )
}

Suggestions.Layout = Layout

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
