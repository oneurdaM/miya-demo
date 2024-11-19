/* eslint-disable @typescript-eslint/no-explicit-any */
import {useState} from 'react'
import {useTranslation} from 'next-i18next'

import StickerCard from '@/components/widgets/sticker-card'
import ErrorMessage from '@/components/ui/error-message'
import Loader from '@/components/ui/loader/loader'

import {userSectorQuery} from '@/data/analytics'
import {ChecklistIcon} from '../icons/summary/checklist'
import Card from '../common/card'
import ControlTable from '../ui/control-table'
import Select from '../ui/select/select'
import Clock from '../ui/clock'
import {CSVLink} from 'react-csv'
import {CsvIcon} from '../icons/csv-icon'
import {useShiftQuery} from '@/data/shift'
import {capitalizeWords} from '@/utils/functions'

interface Shift {
  id: number
  name: string
}

export default function Dashboard() {
  const {t} = useTranslation()
  const [selectedShift,setSelectedShift] = useState('')
  const [text,setText] = useState('Horario')

  const {shifts} = useShiftQuery({
    limit: 10,
    page: 1,
    search: '',
  })

  const {data,loading,error} = userSectorQuery({
    shiftId: selectedShift,
  })

  if (loading) {
    return <Loader text={t('common:text-loading') ?? ''} />
  }
  if (error) {
    return <ErrorMessage message={error?.message} />
  }

  function handleChangeFilter(shift: {label: string; value: string}) {
    if (shift) {
      setSelectedShift(shift.value)
      setText(shift.label)
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
              isDisabled={data.attendances?.length <= 0}
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


      <ControlTable documentos={data.attendances} title={''} />
      <Card>
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {data?.sectorStats.map((elemet: any,id: number) => (
            <StickerCard
              key={id}
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
