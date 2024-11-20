import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/layout/admin'
import { useMeQuery, useUsersQuery } from '@/data/users'
import Loader from '@/components/ui/loader/loader'
import ErrorMessage from '@/components/ui/error-message'
import { UsersResponse } from '@/types/users'
import { useRouter } from 'next/router'
import {
  adminOnly,
  allowedRoles,
  getAuthCredentials,
  hasAccess,
  isAuthenticated,
} from '@/utils/auth-utils'
import SessionDurationChart from '@/components/dashboard/grafic'
import { useAnalyticsQuery } from '@/data/analytics'
import { capitalizeWords } from '@/utils/functions'
import { CalendarIcon } from '@/components/icons/calendar'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { DurationIcon } from '@/components/icons/duration-icon'
import { SessionIcon } from '@/components/icons/sesion-icon'
import { PagesSesionIcon } from '@/components/icons/pages-icon'
import { GetServerSideProps } from 'next'
import { Routes } from '@/config/routes'

export default function Analitycs() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [searchJob, setSearchJob] = useState('')
  const [page, setPage] = useState(1)
  const [userFilter, setUserFilter] = useState<UsersResponse[]>([])
  const { data: me } = useMeQuery()

  const { users, loading, error, paginatorInfo } = useUsersQuery({
    limit: 10,
    page,
    search: searchTerm,
    jobPosition: searchJob,
  })

  const getTodayFormatted = () => {
    const today = new Date()
    return format(today, "d 'de' MMMM 'de' yyyy", { locale: es })
  }

  const { analytics } = useAnalyticsQuery()

  const router = useRouter()

  if (loading) return <Loader text="Cargando usuarios..." />

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

  const analitycsDayYesterday = () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const formattedDate = format(yesterday, 'yyyyMMdd')

    const result = analytics?.data.filter((e: any) => formattedDate === e.date)
    return result
  }
  const yesterday = analitycsDayYesterday()

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-center sm:justify-between bg-white rounded-md py-5 px-6 items-center shadow-md">
        <h2 className="lg:text-3xl md:text-3xl text-xl text-stone-600">
          Hola, {' ' + capitalizeWords(me.firstName + ' ' + me.lastName)}{' '}
        </h2>
        <div className="flex items-center gap-2">
          <span className="lg:text-xl md:text-lg text-stone-600">
            {getTodayFormatted()}
          </span>

          <div className="bg-gray-400 p-2 rounded-full">
            <CalendarIcon color="#fff" width={30} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-3 lg:h-24 gap-3 my-3">
        {yesterday?.map((item: any, index: number) => (
          <>
            <div className="bg-slate-400/5 py-4 rounded-md shadow-xl flex justify-between items-center px-5">
              <div className="bg-gray-100 shadow-md p-2 rounded-full">
                <DurationIcon color="#374151" width={50} />
              </div>
              <div className="text-right text-slate-600">
                <span>Duración Promedio de Sesión ayer (minutos)</span>
                <br />
                <span className="font-bold">
                  Promedio:{' '}
                  {(parseFloat(item.averageSessionDuration) / 60).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-slate-400/5 py-4 rounded-md shadow-xl flex justify-between items-center px-5">
              <div className="bg-gray-100 shadow-md p-2 rounded-full">
                <SessionIcon color="#374151" width={50} />
              </div>
              <div className="text-right text-slate-600">
                <span>Número de Sesiones ayer</span>
                <br />
                <span className="font-bold">Promedio: {item.sessions}</span>
              </div>
            </div>

            <div className="bg-slate-400/5 rounded-md py-4 shadow-xl flex justify-between items-center px-5">
              <div className="bg-gray-100 shadow-md p-2 rounded-full">
                <PagesSesionIcon color="#374151" width={50} />
              </div>
              <div className="text-right text-slate-600">
                <span>Promedio de Páginas por Sesión ayer</span>
                <br />
                <span className="font-bold">
                  Promedio:{' '}
                  {parseFloat(item.averagePageviewsPerSession).toFixed(2)}
                </span>
              </div>
            </div>
          </>
        ))}
      </div>

      <div className="w-full ">
        {analytics?.data?.length > 0 ? (
          <SessionDurationChart data={analytics?.data} />
        ) : (
          <p>Cargando datos...</p>
        )}
      </div>
    </>
  )
}

Analitycs.Layout = Layout

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
