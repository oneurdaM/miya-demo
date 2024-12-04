import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import Layout from '@/components/layout/admin'
import Card from '@/components/common/card'
import { useAttendancesQuery } from '@/data/attendances'
import AttendanceList from '@/components/attendances/attendances-list'
import LinkButton from '@/components/ui/link-button'
import { Routes } from '@/config/routes'
import PageHeading from '@/components/common/page-heading'
import Loader from '@/components/ui/loader/loader'
import Search from '@/components/common/search'
import { Error } from '@/components/ui/error-message'
import Select from '@/components/select/select'
import { attendence } from '@/utils/format-date'
import {
  getAuthCredentials,
  hasAccess,
  adminOnly,
  allowedRoles,
  isAuthenticated,
} from '@/utils/auth-utils'
import { format, subDays } from 'date-fns'
import { es } from 'date-fns/locale'
import { CsvIcon } from '@/components/icons/csv-icon'
import { CSVLink } from 'react-csv'
import { DatePicker } from '@/components/ui/date-picker'
import { capitalizeWords } from '@/utils/functions'
import { GetServerSideProps } from 'next'

export default function Attendances() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusTerm, setStatusTerm] = useState('')
  const [date, setDate] = useState('')
  const [page, setPage] = useState(1)
  const [selectedDate, setSelectedDate] = useState(null)

  const { attendances, paginatorInfo, loading, error } = useAttendancesQuery({
    limit: 10,
    page,
    search: searchTerm,
    status: statusTerm,
    specificDate: date,
  })

  function handlePagination(current: number) {
    setPage(current)
  }

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText)
    setPage(1)
  }

  if (loading) return <Loader text={t('common:loading') ?? ''} />
  if (error) return <Error message={error.message} />

  function filterAttendence(value: any) {
    if (value) {
      setStatusTerm(value.value)
    } else {
      setStatusTerm('')
    }
  }

  function getDaysOfMonth(year: number, month: number) {
    const days = []
    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0)

    for (
      let date = startDate;
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const valueDate = new Date(date)
      valueDate.setDate(valueDate.getDate() - 1)

      const valueString = format(valueDate, 'yyyy-MM-dd')
      const labelString = format(date, "eeee d 'de' MMMM 'de' yyyy", {
        locale: es,
      })

      days.push({
        value: valueString,
        label: labelString,
      })
    }

    return days
  }

  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()

  const daysOfMonth = getDaysOfMonth(year, month)

  const { permissions } = getAuthCredentials()
  let permission = hasAccess(adminOnly, permissions)

  const exportDocument =
    attendances?.map(
      ({
        user,
        id,
        checkIn,
        checkOut,
        userId,
        status,
        latitude,
        longitude,
        shiftId,
        createdAt,
        sectorId,
        ...rest
      }) => ({
        Usuario: capitalizeWords(user.firstName + ' ' + user.lastName),
        Ubicación: capitalizeWords(user?.sector?.name),
        Entrada: checkIn
          ? format(
              new Date(checkIn),
              "eeee d 'de' MMMM 'de' yyyy, 'a las' HH:mm",
              { locale: es }
            )
          : 'Fecha no disponible',
        Salida: checkOut
          ? format(
              new Date(checkOut),
              "eeee d 'de' MMMM 'de' yyyy, 'a las' HH:mm",
              { locale: es }
            )
          : 'Fecha no disponible',
        Estado:
          status === 'ON_SITE' ? t('common:ON_SITE') : t('common:OFF_SITE'),

        ...rest,
      })
    ) || []

  const handleDateEndChange = (date: any) => {
    if (date) {
      const newDate = subDays(date, 1)
      const dateFormat = format(newDate, 'yyyy-MM-dd')

      //@ts-ignore
      setSelectedDate(date)
      setDate(dateFormat)
    } else {
      setSelectedDate(null)
      setDate('')
    }
  }
  return (
    <>
      <Card className="mb-8 block  items-center xl:flex-row">
        <div className="mb-4 md:mb-0 ">
          <PageHeading title={t('table:attendances')} />
        </div>

        <div className="flex w-full flex-col gap-2 mt-10 items-center space-y-4 ms-auto md:flex-row md:space-y-0 xl:w-full">
          <Search onSearch={handleSearch} className="w-1/2" />
          <Select
            isClearable
            className="w-full md:w-1/2"
            options={attendence}
            onChange={(e: any) => filterAttendence(e)}
            placeholder="Seleccione estado"
          />
          <div className="flex w-full gap-2">
            <DatePicker
              locale={es}
              className="w-1/2"
              selected={selectedDate}
              onChange={(date) => handleDateEndChange(date)}
              isClearable
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecciona una fecha"
            />

           
          </div>
          {permission ? (
            <LinkButton
              href={`${Routes.shifts.create}`}
              className="h-12 w-full md:w-auto rounded-md"
            >
              <span>+ {t('form:create-shifts-label')}</span>
            </LinkButton>
          ) : null}

<div className="border-2 py-2 pl-3 pr-2 rounded-full flex items-center">
              <CSVLink
                data={exportDocument}
                filename={`Reporte-asistencia.csv`}
              >
                <CsvIcon width={30} />
              </CSVLink>
            </div>
        </div>
      </Card>
      <AttendanceList
        attendances={attendances}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
      />
    </>
  )
}

Attendances.Layout = Layout

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
