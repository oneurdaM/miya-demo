/* eslint-disable @typescript-eslint/no-explicit-any */
import {useRouter} from 'next/router'
import React,{useState} from 'react'
import {Loader} from 'rizzui'
import {useModalState} from '../ui/modal/modal.context'
import {useUserCheckpointQuery} from '@/data/user'
import {addDays} from 'date-fns'
import {es} from 'date-fns/locale'
import {DatePicker} from '../ui/date-picker'
import {formatDateCabos} from '@/utils/format-date'


function ShowCheckpointModal() {
  const router = useRouter()
  const {id} = router.query
  const {data: modalData} = useModalState()
  const [selectedDate,setSelectedDate] = useState(null)

  const {user,loading,} = useUserCheckpointQuery({
    id: Number(modalData),
  })
  const [dateIso,setDateIso] = useState('')
  function restarHoras(horaOriginal: any,horasARestar: any) {
    const [horas,minutos,segundos] = horaOriginal.split(':').map(Number)

    const fecha = new Date()
    fecha.setHours(horas,minutos,segundos,0)

    fecha.setHours(fecha.getHours() - horasARestar)

    const nuevaHora = [
      String(fecha.getHours()).padStart(2,'0'),
      String(fecha.getMinutes()).padStart(2,'0'),
      String(fecha.getSeconds()).padStart(2,'0'),
    ].join(':')

    return nuevaHora
  }

  function prueba(roundId: number) {
    const uniqueDates = new Set()

    user?.checkpointLog?.forEach((element) => {
      if (element.roundId === roundId) {
        const date = element.timestamp.split('T')[0]
        uniqueDates.add(date)
      }
    })

    const uniqueDatesArray = Array.from(uniqueDates).map((date: any) => ({
      label: formatDateCabos(date),
    }))

    return uniqueDatesArray
  }

  const dates = prueba(Number(id))

  const handleDateEndChange = (date: any) => {
    if (date) {
      const newDate = new Date(date)
      newDate.setDate(newDate.getDate())
      const addDay = addDays(newDate,1)
      setDateIso(addDay.toISOString().split('T')[0])
      setSelectedDate(date)
    } else {
      setSelectedDate(null)
      setDateIso('')
    }
  }
  return (
    <div className="bg-white p-8 rounded shadow-lg h-full">
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-semibold mb-2 text-center text-2xl text-gray-700 w-3/4 ">
          Checkpoint logs
        </h2>
        <div className="w-1/2">
          <DatePicker
            locale={es}
            selected={selectedDate}
            onChange={(date: Date | null) => handleDateEndChange(date)}
            isClearable
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecciona una fecha"
          />
        </div>
      </div>

      <div className="border-b-4 mb-3 "></div>
      <div
        className={`justify-center grid  ${dateIso !== '' ? 'grid-cols-4 ' : 'grid-cols-1'
          }   `}
      >
        {
          user?.checkpointLog?.map((checkpoint,index) => (
            <>
              {Number(id) === checkpoint.roundId ? (
                <div className="flex items-center ml-8 " key={index}>
                  <>
                    {
                      dateIso === checkpoint.timestamp.split('T')[0] ? (
                        <div className="relative -z-0 mb-4">
                          <div className="ml-4 text-gray-500">
                            Checkpoint{' '}
                            <strong>{checkpoint.checkpoint.location}</strong>
                          </div>
                          <div className="flex justify-center">
                            <div className="relative z-10 flex items-center justify-center h-12 w-12 rounded-full bg-blue-400 text-white">
                              {checkpoint.checkpoint.id}
                            </div>
                          </div>

                          <span className="flex justify-center text-gray-700 bg-green-300 py-1 mt-2 rounded-md">
                            {restarHoras(
                              checkpoint?.timestamp.split('T')[1].split('.')[0],
                              6
                            )}
                          </span>
                        </div>
                      ) : null
                    }
                  </>
                </div>
              ) : null}
            </>
          ))}

        {dateIso === '' ? (
          <div className="py-3">
            <div className="flex flex-col justify-center items-center w-full text-gray-500">
              <span className="font-bold my-2">Fechas Registradas</span>
              {loading ? (
                <Loader size="xl" />
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  {dates.map((e,index) => (
                    <div
                      key={index}
                      className="p-2 border-2 rounded-md border-blue-200 bg-blue-100"
                    >
                      <p className="text-center">{e.label.label}</p>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-3xl mt-3 text-center text-gray-500">
                No se ha seleccionado una fecha
              </p>
            </div>
          </div>
        ) : null}
      </div>
      <div className="border-b-2 border-dashed mb-3 my-3"></div>
    </div>
  )
}

export default ShowCheckpointModal
