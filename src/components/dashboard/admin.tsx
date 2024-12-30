import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import dayjs from 'dayjs'

import StickerCard from '@/components/widgets/sticker-card'
import ErrorMessage from '@/components/ui/error-message'
import Loader from '@/components/ui/loader/loader'

import { userSectorQuery } from '@/data/analytics'
import { ChecklistIcon } from '../icons/summary/checklist'
import Card from '../common/card'
import ControlTable from '../ui/control-table'
import Select from '../ui/select/select'
import Clock from '../ui/clock'
import { CSVLink } from 'react-csv'
import { CsvIcon } from '../icons/csv-icon'
import { useShiftQuery } from '@/data/shift'
import { capitalizeWords } from '@/utils/functions'
import { useMeQuery } from '@/data/user'

interface Shift {
  id: number
  name: string
}

export default function Dashboard() {
  const { t } = useTranslation()
  const [selected, setSelected] = useState(false)
  const [activeTimeFrame, setActiveTimeFrame] = useState(1)
  const [selectedShift, setSelectedShift] = useState('')
  const [text, setText] = useState('Horario')
  const { data: me } = useMeQuery()

  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date(),
  })

  const { shifts } = useShiftQuery({
    limit: 10,
    page: 1,
    search: '',
  })

  const { data, loading, error } = userSectorQuery({
    shiftId: selectedShift,
  })

  if (loading) {
    return <Loader text={t('common:text-loading') ?? ''} />
  }
  if (error) {
    return <ErrorMessage message={error?.message} />
  }

  const timeFrame = [
    { name: t('text-today'), day: 1 },
    { name: t('text-weekly'), day: 7 },
    { name: t('text-monthly'), day: 30 },
    { name: t('text-yearly'), day: 365 },
  ]
  const handleValueChange = (value: any) => {
    if (value.startDate === null || value.endDate === null) {
      setSelected(false)
    } else {
      setSelected(true)
    }
    setValue(value)
  }

  function formatDate(date: Date) {
    return dayjs(date).format('DD MMMM, YYYY')
  }

  function handleChangeFilter(shiftId: any) {
    if (shiftId) {
      setSelectedShift(shiftId.value)
      setText(shiftId.label)
    } else {
      setText('Horario')
      setSelectedShift('')
    }
  }

  return (
    <>
      <Card className="mb-8 flex flex-col lg:flex-row lg:items-start gap-7 lg:gap-8 2xl:grid ">
        <div className="mb-5 flex items-center justify-between lg:mb-7">
          <h3 className="relative mt-1 bg-light text-lg font-semibold text-heading before:content-[''] before:absolute before:-top-1 before:h-7 before:w-1 before:rounded-tr-md before:rounded-br-md before:bg-accent ltr:before:-left-6 rtl:before:-right-6 md:before:-top-1.5 md:ltr:before:-left-7 md:rtl:before:-right-7 lg:before:h-8">
            {t('text-summary-control')}
          </h3>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:w-full gap-4">
          <div className="w-full lg:w-1/2">
            <div className="flex flex-col lg:flex-row lg:justify-between px-5 py-2 border-2 border-blue-950 rounded-md w-full lg:items-center">
              <h2 className="text-lg font-bold lg:text-xl">{text}</h2>
              <p className="text-lg font-bold lg:text-xl flex items-center">
                <Clock />
              </p>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex items-center gap-4 lg:gap-2">
            <Select
              // isDisabled={data.attendances?.length <= 0}
              isClearable={true}
              options={shifts?.map((e: Shift) => ({
                label: e.name,
                value: e.id,
              }))}
              className="w-full"
              onChange={(e: any) => {
                handleChangeFilter(e)
              }}
              getOptionLabel={(option: any) => `${t(option.label)}`}
              placeholder={'Selecciona Turno'}
            />

            {data.attendances?.length > 0 && (
              <div className="border-2 py-2 pl-3 pr-2 rounded-full flex items-center">
                <CSVLink data={[]} filename={`export-$.csv`}>
                  <CsvIcon width={30} />
                </CSVLink>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* </div> */}
      {/* <div className="col-span-full rounded-lg bg-light p-6 md:p-7">
        <div className="mb-5 flex items-center justify-between md:mb-7">
          <h3 className="before:content-'' relative mt-1 bg-light text-lg font-semibold text-heading before:absolute before:-top-px before:h-7 before:w-1 before:rounded-tr-md before:rounded-br-md before:bg-accent ltr:before:-left-6 rtl:before:-right-6 md:before:-top-0.5 md:ltr:before:-left-7 md:rtl:before:-right-7 lg:before:h-8">
            {t('text-summary')}
          </h3>
        </div>

        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StickerCard
            titleTransKey="widgets:sticker-card-title-rev"
            subtitleTransKey="sticker-card-subtitle-rev"
            icon={<EaringIcon className="h-8 w-8" />}
            color="#1EAE98"
            price={analytics.alertsCount}
          />
          <StickerCard
            titleTransKey="widgets:sticker-card-title-order"
            subtitleTransKey="sticker-card-subtitle-order"
            icon={<ShoppingIcon className="h-8 w-8" />}
            color="#865DFF"
            price={analytics.notesCount}
          />
          <StickerCard
            titleTransKey="widgets:sticker-card-title-vendor"
            icon={<ChecklistIcon className="h-8 w-8" />}
            color="#D74EFF"
            price={0}
          />
          <StickerCard
            titleTransKey="widgets:sticker-card-title-total-attendances"
            icon={<BasketIcon className="h-8 w-8" />}
            color="#E157A0"
            price={0}
          />
        </div>
      </div> */}

      {/* <div className="col-span-full rounded-lg bg-light p-6 md:p-7">
        <div className="mb-5 items-center justify-between sm:flex md:mb-7">
          <h3 className="before:content-'' relative mt-1 bg-light text-lg font-semibold text-heading before:absolute before:-top-px before:h-7 before:w-1 before:rounded-tr-md before:rounded-br-md before:bg-accent ltr:before:-left-6 rtl:before:-right-6 md:before:-top-0.5 md:ltr:before:-left-7 md:rtl:before:-right-7 lg:before:h-8">
            Estado de las alertas
          </h3>
          <div className="mt-3.5 inline-flex rounded-full bg-gray-100/80 p-1.5 sm:mt-0">
            {timeFrame
              ? timeFrame.map((time) => (
                  <div key={time.day} className="relative">
                    <Button
                      className={cn(
                        '!focus:ring-0  relative z-10 !h-7 rounded-full !px-2.5 text-sm font-medium text-gray-500',
                        time.day === activeTimeFrame ? 'text-accent' : ''
                      )}
                      type="button"
                      onClick={() => setActiveTimeFrame(time.day)}
                      variant="custom"
                    >
                      {time.name}
                    </Button>
                    {time.day === activeTimeFrame ? (
                      <motion.div className="absolute bottom-0 left-0 right-0 z-0 h-full rounded-3xl bg-accent/10" />
                    ) : null}
                  </div>
                ))
              : null}
          </div>
        </div> */}

      {/* <OrderStatusWidget
          order={orderDataRange}
          timeFrame={activeTimeFrame}
          allowedStatus={[
            'pending',
            'processing',
            'complete',
            'cancel',
            // 'out-for-delivery',
          ]}
        /> */}
      {/* </div> */}

      {/* <RecentOrders
        className="col-span-full"
        orders={orderData}
        paginatorInfo={orderPaginatorInfo}
        title={t('table:recent-order-table-title')}
        onPagination={handlePagination}
        searchElement={
          <Search
            onSearch={handleSearch}
            placeholderText={t('form:input-placeholder-search-name')}
            className="hidden max-w-sm sm:inline-block [&button]:top-0.5"
            inputClassName="!h-10"
          />
        }
      /> */}
      {/* <div className="lg:col-span-full 2xl:col-span-8">
        <ColumnChart
          widgetTitle={'Historial de alertas'}
          colors={['#6073D4']}
          series={salesByYear}
          categories={[
            t('common:january'),
            t('common:february'),
            t('common:march'),
            t('common:april'),
            t('common:may'),
            t('common:june'),
            t('common:july'),
            t('common:august'),
            t('common:september'),
            t('common:october'),
            t('common:november'),
            t('common:december'),
          ]}
        />
      </div> */}

      <ControlTable documentos={data.attendances} title={''} />

      {/* <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-2">
          <div className="w-full">
            <Datepicker
              primaryColor={'sky'}
              value={value}
              onChange={handleValueChange}
              maxDate={new Date()}
              minDate={new Date('2021-01-01')}
              displayFormat="DD/MM/YYYY"
            />
          </div>
          <div className="w-full">
            <div className="col-span-2 mb-4 flex justify-center">
              <p className="text-center text-gray-700">
                {selected
                  ? `${formatDate(value.startDate)} | ${formatDate(
                      value.endDate
                    )}`
                  : t('common:select-range')}
              </p>
            </div>

      
            <div className="col-span-2 flex justify-center">
              <button
                className="focus:shadow-outline rounded bg-blue-800 px-4 py-2 font-bold text-white hover:bg-blue-900 focus:outline-none disabled:opacity-50"
                disabled={!selected}
              >
                {t('common:download-report')}
              </button>
            </div>
          </div>
        </div> */}
      <Card>
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {data?.sectorStats.map((elemet: any, id: Number) => (
            <StickerCard
              titleTransKey={capitalizeWords(elemet.sector)}
              subtitleTransKey="sticker-card-subtitle-rev"
              icon={<ChecklistIcon className="h-8 w-8" />}
              color="#1EAE98"
              price={
                <>
                  <div className="flex justify-end text-stone-700">
                    <p className="text-xs">Total de usuarios:</p>
                    <p className="text-xs mx-2">{elemet.totalUsers}</p>
                  </div>
                </>
              }
            />
          ))}
        </div>
      </Card>
    </>
  )
}
