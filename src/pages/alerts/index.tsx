import Layout from '@/components/layout/admin'
import Card from '@/components/common/card'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import AlertList from '@/components/alert/alert-list'
import { useState } from 'react'
import Loader from '@/components/ui/loader/loader'
import ErrorMessage from '@/components/ui/error-message'
import { useAlertsQuery } from '@/data/alert'
import Search from '@/components/common/search'
import { LIMIT } from '@/utils/constants'
import { DatePicker } from '@/components/ui/date-picker'
import { es } from 'date-fns/locale'
import { format } from 'date-fns'
import Select from '@/components/select/select'
import { getAlertStatus } from '@/utils/alert-status'
import { AlertStatusArray } from '@/types/alerts'
import { useTranslation } from 'react-i18next'
import { GeneratePdf } from '@/utils/generatePdfIncident'
import { getFormattedDateInLosCabos } from '@/utils/format-date'
import { GetServerSideProps } from 'next'
import {
  allowedRoles,
  getAuthCredentials,
  hasAccess,
  isAuthenticated,
} from '@/utils/auth-utils'
import { Routes } from '@/config/routes'

export default function Alerts() {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectStatus, setSelectedstatus] = useState('')
  const [selectedDateString, setSelectedDateString] = useState('')

  const todayCabosDate = getFormattedDateInLosCabos()

  const { alerts, loading, error, paginatorInfo } = useAlertsQuery({
    limit: LIMIT,
    page,
    search: searchTerm,
    dateFilter: selectedDateString,
    status: selectStatus,
  })

  if (loading) return <Loader text="Cargando alertas..." />

  if (error) return <ErrorMessage message={error.message} />

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText)
    setPage(1)
  }

  function handlePagination(current: number) {
    setPage(current)
  }

  const handleDateChange = (date: any) => {
    if (date) {
      setSelectedDate(date)
      const formattedDate = format(date, 'yyyy-MM-dd')
      setSelectedDateString(formattedDate)
    } else {
      setSelectedDateString('')
      setSelectedDate(null)
    }
  }

  const handleStatusChange = (status: any) => {
    if (status) {
      setSelectedstatus(status.value)
    } else {
      setSelectedstatus('')
    }
  }
  return (
    <>
      <Card className="mb-8 flex flex-col md:flex-row items-center">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <h1 className="text-lg font-semibold text-heading">Alertas</h1>
        </div>

        <div className="flex flex-col md:flex-row w-full items-center ms-auto md:w-3/4 gap-3">
          <Select
            name="status"
            getOptionLabel={(option: any) => t(getAlertStatus(option.value))}
            getOptionValue={(option: any) => option.value}
            options={AlertStatusArray}
            placeholder={'Alerta Estatus'}
            className="w-1/4"
            onChange={handleStatusChange}
          />
          <div className="w-full md:w-1/3">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => handleDateChange(date)}
              timeIntervals={30}
              dateFormat="yyyy-MM-dd"
              placeholderText="Selecciona una fecha"
              locale={es}
              isClearable
            />
          </div>

          <div className="w-full md:w-3/4">
            <Search onSearch={handleSearch} />
          </div>

          <div className="w-full border-red-100 bg-red-200 md:w-auto border-2 py-2 px-3 rounded-full flex justify-center mb-4 md:mb-0 hover:bg-red-400 hover:transition-all ease-in-out hover:border-red-500 hover:cursor-pointer">
            {/* <CSVLink data={alerts} filename={`export-alerts-${today}.csv`}>
              <CsvIcon width={30} />
            </CSVLink> */}
            <GeneratePdf
              date={selectedDateString ? selectedDateString : todayCabosDate}
              selectedDateString={selectedDateString}
              searchTerm={searchTerm}
              page={page}
            />
          </div>
        </div>
      </Card>

      <AlertList
        alerts={alerts}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
      />
    </>
  )
}

Alerts.Layout = Layout

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
