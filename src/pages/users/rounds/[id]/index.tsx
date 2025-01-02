import { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Layout from '@/components/layout/admin'
import Card from '@/components/common/card'
import Loader from '@/components/ui/loader/loader'
import ErrorMessage from '@/components/ui/error-message'
import PageHeading from '@/components/common/page-heading'
import { switchJobPosition, UsersResponse } from '@/types/users'
import { useRouter } from 'next/router'
import { WaitIcon } from '@/components/icons/wait-icon copy'
import { addDays, format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useUserQuery } from '@/data/user'
import { CheckedBorderIcon } from '@/components/icons/check-icon'
import { Modal } from 'rizzui'
import SelectInput from '@/components/ui/select-input'
import Select from '@/components/ui/select/select'
import { formatDateCabos, mesesDelAño } from '@/utils/format-date'
import { TrackingRoundIcon } from '@/components/icons/tracking-round'
import { useModalState } from '@/components/ui/modal/modal.context'
import { log } from 'fabric/fabric-impl'
import ActionButtons from '@/components/common/action-buttons'
import UserJobposition from '@/components/ui/userJobposition'
import { DontAllowed } from '@/components/icons/dont-allowed'
import Button from '@/components/ui/button'
import Image from 'next/image'
import { DatePicker } from '@/components/ui/date-picker'
import { Loader as LoaderRuizzi } from 'rizzui'
import { Routes } from '@/config/routes'
import {
  getAuthCredentials,
  isAuthenticated,
  hasAccess,
  allowedRoles,
} from '@/utils/auth-utils'
import { GetServerSideProps } from 'next'

export default function UserRound() {
  interface DayObject {
    dateFormat: string
    date: string
  }
  const { t } = useTranslation()
  const today = new Date().toISOString().split('T')[0]

  const { data: modalData } = useModalState()
  const [uniqueDates, setUniqueDates] = useState([])
  const [date, setDate] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [searchJob, setSearchJob] = useState('')
  const [page, setPage] = useState(1)
  const [userFilter, _setUserFilter] = useState<UsersResponse[]>([])

  const fechaActual = new Date()

  const mesActualNumero = parseInt(format(fechaActual, 'M'), 10)
  const mesActual = mesesDelAño.find((mes) => mes.value === mesActualNumero)
  const [month, setMonth] = useState(mesActual)
  const [selectedDate, setSelectedDate] = useState(null)

  const [show, setShow] = useState(false)
  const [idRound, setIdRound] = useState(0)

  const router = useRouter()
  const [dateIso, setDateIso] = useState('')

  const {
    query: { id },
  } = router

  const { user, loading, error } = useUserQuery({
    id: Number(id),
  })

  user?.jobPosition?.name
  if (loading) return <Loader text="Cargando usuarios..." />

  if (error) return <ErrorMessage message={error.message} />

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText)
    setPage(1)
  }

  function handlePagination(current: number) {
    setPage(current)
  }

  function handleChangeFilter(value: any) {
    if (value) {
      setSearchJob(value.value)
    } else {
      setSearchJob('')
    }
  }

  if (loading) return <Loader />

  const fiveDays = []

  const fechaFormateada = (fecha: string): string => {
    const date = new Date(fecha)
    date.setDate(date.getDate() + 1)
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  function restarHoras(horaOriginal: any, horasARestar: any) {
    const [horas, minutos, segundos] = horaOriginal.split(':').map(Number)

    const fecha = new Date()
    fecha.setHours(horas, minutos, segundos, 0)

    fecha.setHours(fecha.getHours() - horasARestar)
    const nuevaHora = [
      String(fecha.getHours()).padStart(2, '0'),
      String(fecha.getMinutes()).padStart(2, '0'),
      String(fecha.getSeconds()).padStart(2, '0'),
    ].join(':')

    return nuevaHora
  }

  const groupedByRoundId = user?.checkpointLog?.reduce((acc: any, item) => {
    if (!acc[item.roundId]) {
      acc[item.roundId] = []
    }

    acc[item.roundId].push(item)
    return acc
  }, {})

  // Convertir el objeto agrupado en un arreglo de arreglos
  const result = Object.values(groupedByRoundId)

  // const groupedData = Object.values(groupByRoundId(user?.checkpointLog))

  // return (
  //   <>
  //     <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
  //       {/* Columna izquierda */}
  //       <div className="w-full md:w-1/2 mb-5 md:mb-0">
  //         <PageHeading
  //           className="text-2xl"
  //           title={`${user?.firstName} ${user?.lastName} - ${user?.jobPosition}`}
  //         />
  //       </div>

  //       {/* Columna derecha */}
  //       <div className="w-full md:w-1/2 flex flex-col md:flex-row items-start md:items-center md:justify-end">
  //         <p className="bg-green-300 rounded-md text-gray-600 p-2 mb-3 md:mb-0 md:mr-3">
  //           Año: {currentYear}
  //         </p>
  //         <Select
  //           className="w-full md:w-1/2"
  //           options={mesesDelAño}
  //           onChange={(e: any) => setMonth(e)}
  //           value={month}
  //         />
  //       </div>
  //     </div>
  //     <div>
  //       <div className="flex items-center my-8">
  //         <span className="ml-2 text-xl text-stone-800"></span>
  //         <div className="flex-1 border-t border-gray-300 my-1"></div>
  //       </div>
  //       <div
  //         className={`mb-8 grid sm:grid-cols-1  ${
  //           //@ts-ignore
  //           filteredRounds.length > 0 ? 'lg:grid-cols-3' : 'lg:grid-cols-1'
  //         }  gap-10 flex-col items-center md:flex-row `}
  //       >
  //         {
  //           //@ts-ignore
  //           filteredRounds.length > 0 ? (
  //             //@ts-ignore
  //             filteredRounds.map((userRound: any, index: any) => (
  //               <div
  //                 key={userRound.id}
  //                 onClick={() => {
  //                   setShow(!show)
  //                   setIdRound(userRound.id)
  //                   console.log(userRound.id)
  //                 }}
  //               >
  //                 <p className="text-xl text-gray-600">
  //                   {fechaFormateada(userRound.start.split('T')[0])}
  //                 </p>
  //                 <Card className="mb-8 flex flex-col items-center md:flex-row shadow-2xl transform hover:scale-110 transition-transform ease-in-out hover:cursor-pointer">
  //                   <div className="flex w-full">
  //                     <div className="flex items-center space-x-3">
  //                       <div
  //                         className={`bg-pink-300 lg:px-5 px-5 py-3 rounded-full lg:py-3 sm:py-5 sm:px-7 text-white`}
  //                       >
  //                         {index + 1}
  //                       </div>
  //                     </div>
  //                     <div className="border-l-2 ml-4 transform border-dashed border-gray-300 lg:h-16 sm:h-22"></div>
  //                     <div className="mx-auto">
  //                       <h2 className={`text-pink-300 lg:text-xl sm:text-3xl`}>
  //                         {userRound.name}
  //                       </h2>
  //                       <p className="lg:text-lg sm:my-4 lg:my-0 sm:text-2xl text-gray-600 bg-blue-300 px-3 rounded-md">
  //                         {userRound.status}
  //                       </p>
  //                     </div>
  //                     <div className="border-l-2 mr-4 transform border-dashed border-gray-300 lg:h-16 sm:h-22"></div>
  //                     <div className="flex justify-center items-center">
  //                       {userRound.status === 'COMPLETED' ? (
  //                         <CheckedBorderIcon width={53} />
  //                       ) : (
  //                         <WaitIcon width={53} />
  //                       )}
  //                     </div>
  //                   </div>
  //                 </Card>
  //               </div>
  //             ))
  //           ) : (
  //             <div className="border-2 rounded-full py-3">
  //               <div className="flex justify-center items-center w-full h-64  text-gray-500">
  //                 <TrackingRoundIcon />
  //               </div>
  //               <p className="text-3xl text-center text-gray-500">
  //                 No hay rondines en este mes
  //               </p>
  //             </div>
  //           )
  //         }
  //       </div>
  //     </div>
  //     <Modal
  //       isOpen={show}
  //       onClose={() => {
  //         setShow(!show)
  //       }}
  //       containerClassName="!max-w-3xl !shadow-2xl"
  //     >
  //       <div className="bg-white p-8 rounded shadow-lg">
  //         <h2 className="font-semibold mb-2 text-center text-2xl text-gray-700">
  //           Checkpoint logs
  //         </h2>
  //         <div className="border-b-4 mb-3 "></div>

  //         <div className="justify-center grid grid-cols-4">
  //           {//@ts-ignore
  //           user?.checkpointLog.map((checkpoint, index) => (
  //             <>
  //               {idRound === checkpoint.roundId ? (
  //                 <div className="flex items-center ml-8 mb-2">
  //                   <div className="relative">
  //                     <div className="ml-4 text-gray-500">
  //                       Checkpoint {checkpoint.id}
  //                     </div>
  //                     <div className="flex justify-center">
  //                       <div className="relative z-10 flex items-center justify-center h-12 w-12 rounded-full bg-blue-400 text-white">
  //                         {checkpoint.id}
  //                       </div>
  //                     </div>

  //                     <span className="flex justify-center text-gray-700 bg-green-300 py-1 mt-2 rounded-md">
  //                       {
  //                         //@ts-ignore

  //                         restarHoras(
  //                           //@ts-ignore
  //                           checkpoint?.timestamp.split('T')[1].split('.')[0],
  //                           8
  //                         )
  //                       }
  //                     </span>

  //                     {/* {index !== 4 &&
  //                       index !== */}
  //                     {/* //@ts-ignore user.checkpointLog.length - 1 && ( */}
  //                     {/* <div className="absolute top-[50px] left-[123px] transform -translate-x-1/2 -translate-y-1/2 w-44 h-1 bg-green-500/30"></div> */}
  //                     {/*   )} */}
  //                   </div>
  //                 </div>
  //               ) : null}
  //             </>
  //           ))}
  //         </div>

  //         <div className="border-b-2 border-dashed mb-3 my-3"></div>

  //         {/* <div className="flex justify-center mt-2">
  //           <div className="border-1 border w-1/2 h-full rounded-md shadow-xl">
  //             <div className="mx-2 text-center py-2 text-gray-700">
  //               Checkpoints: <span>{user?.checkpointLog.length}</span>
  //             </div>
  //             <div className="border-b-2 border-dashed mb-3 mx-2"></div>

  //             <div className="grid grid-cols-2 py-3">
  //               <div className="mx-2  text-gray-700">
  //                 Tiempo Usuario: <span>{user?.checkpointLog.length}</span>
  //               </div>
  //               <div className="mx-2  text-gray-700">
  //                 Tiempo estimado: <span>{user?.checkpointLog.length}</span>
  //               </div>
  //             </div>
  //           </div>
  //         </div> */}
  //       </div>
  //     </Modal>
  //   </>
  // )
  const handleDateEndChange = (date: any) => {
    if (date) {
      const newDate = new Date(date)
      newDate.setDate(newDate.getDate())
      const addDay = addDays(newDate, 1)

      setDateIso(addDay.toISOString().split('T')[0])

      setSelectedDate(date)
    } else {
      setSelectedDate(null)
      setDateIso('')
    }
  }

  function formatDateToSpanish(dateString: string): string {
    const date = parseISO(dateString)
    return format(date, "eeee d 'de' MMMM yyyy", { locale: es })
  }

  function prueba(roundId: number) {
    let uniqueDates = new Set()

    user?.checkpointLog?.forEach((element) => {
      if (element.roundId === roundId) {
        //@ts-ignore
        const date = element.timestamp.split('T')[0]
        uniqueDates.add(date)
      }
    })

    const uniqueDatesArray = Array.from(uniqueDates).map((date: any) => ({
      value: date,
      label: formatDateCabos(date),
    }))

    return uniqueDatesArray
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        {/* Columna izquierda */}
        <div className="w-full md:w-1/2 mb-5 md:mb-0">
          {user && (
            <UserJobposition
              firstName={user?.firstName}
              lastName={user?.lastName}
              jobposition={user.jobPosition?.name}
            />
          )}
        </div>
        <Button
          type="button"
          onClick={() => router.back()}
          className="bg-zinc-600 mx-3"
        >
          {t('form:form-button-back')}
        </Button>
      </div>

      {result.length > 0 ? (
        <div
          className={`mb-8 mt-8 grid sm:grid-cols-1 lg:grid-cols-3 gap-10 flex-col items-center md:flex-row `}
        >
          {result.map((group: any, index) => (
            <div key={index} className="mt-">
              <div
                key={group[0].roundId}
                onClick={() => {
                  setShow(!show)
                  setIdRound(group[0].roundId)
                  const dates = prueba(group[0].roundId)
                  //@ts-ignore
                  setUniqueDates(dates)
                }}
              >
                <Card className="mb-8 flex flex-col items-center md:flex-row shadow-2xl transform hover:scale-110 transition-transform ease-in-out hover:cursor-pointer">
                  <div className="flex w-full">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`bg-pink-300 lg:px-5 px-5 py-3 rounded-full lg:py-3 sm:py-5 sm:px-7 text-white`}
                      >
                        {group[0].roundId}
                      </div>
                    </div>
                    <div className="border-l-2 ml-4 transform border-dashed border-gray-300 lg:h-16 sm:h-22"></div>
                    <div className="mx-auto">
                      <h2 className={`text-pink-300 lg:text-xl sm:text-3xl`}>
                        {group[0].round.name}
                      </h2>
                      <p className="lg:text-lg sm:my-4 lg:my-0 sm:text-2xl text-gray-600 bg-blue-300 px-3 rounded-md">
                        {group[0].round.status}
                      </p>
                    </div>
                    <div className="border-l-2 mr-4 transform border-dashed border-gray-300 lg:h-16 sm:h-22"></div>
                    <div className="flex justify-center items-center">
                      {group[0].round.status === 'COMPLETED' ? (
                        <CheckedBorderIcon width={53} />
                      ) : (
                        <WaitIcon width={53} />
                      )}
                    </div>
                  </div>
                </Card>
              </div>

              <Modal
                isOpen={show}
                onClose={() => {
                  setShow(!show)
                  setDateIso('')
                  setSelectedDate(null)
                }}
                containerClassName="!max-w-3xl  !shadow-2xl "
              >
                <div className="bg-white p-8 rounded shadow-lg h-[350px]  overflow-y-auto ">
                  <div className="flex justify-between items-center mb-5 z-50">
                    <h2 className="font-semibold mb-2 text-center text-2xl text-gray-700">
                      Checkpoint logs
                    </h2>
                    {/* 
                    <Select
                      className="w-1/2 "
                      options={uniqueDates}
                      onChange={(e: any) => setDate(e.value)}
                    /> */}

                    <div className="w-1/2">
                      <DatePicker
                        locale={es}
                        selected={selectedDate}
                        onChange={(date) => handleDateEndChange(date)}
                        isClearable
                        // disabled={disabledDateEnd}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Selecciona una fecha"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="border-b-4 mb-3 "></div>
                  <div
                    className={`justify-center grid  ${
                      dateIso !== '' ? 'grid-cols-4 ' : 'grid-cols-1'
                    }   `}
                  >
                    {//@ts-ignore
                    user?.checkpointLog.map((checkpoint, index) => (
                      <>
                        {idRound === checkpoint.roundId ? (
                          <div className="flex items-center ml-8 ">
                            {/* {uniqueDates.map((elemen) => ( */}
                            <>
                              {
                                //@ts-ignore
                                dateIso ===
                                checkpoint.timestamp.split('T')[0] ? (
                                  <div className="relative -z-0">
                                    <div className="text-gray-500 text-center">
                                      <strong>
                                        {checkpoint.checkpoint.location}
                                      </strong>
                                    </div>
                                    <div className="flex justify-center">
                                      <div className="relative z-10 flex items-center justify-center h-12 w-12 rounded-full bg-blue-400 text-white">
                                        {checkpoint.id}
                                      </div>
                                    </div>

                                    <span className="flex justify-center text-gray-700 bg-green-300 py-1 px-2 mt-2 rounded-md">
                                      {
                                        //@ts-ignore

                                        restarHoras(
                                          //@ts-ignore
                                          checkpoint?.timestamp
                                            .split('T')[1]
                                            .split('.')[0],
                                          6
                                        )
                                      }
                                    </span>

                                    {/* {index !== 4 &&
                    index !== */}
                                    {/* //@ts-ignore user.checkpointLog.length - 1 && ( */}
                                    {/* <div className="absolute top-[50px] left-[123px] transform -translate-x-1/2 -translate-y-1/2 w-44 h-1 bg-green-500/30"></div> */}
                                    {/*   )} */}
                                  </div>
                                ) : null
                              }
                            </>
                            {/* ))} */}
                          </div>
                        ) : null}
                      </>
                    ))}

                    {dateIso === '' ? (
                      <div className="py-3">
                        <div className="flex flex-col justify-center items-center w-full text-gray-500">
                          <span className="font-bold my-2">
                            Fechas Registradas
                          </span>
                          {loading ? (
                            <LoaderRuizzi size="xl" />
                          ) : (
                            <div className="grid grid-cols-3 gap-4">
                              {uniqueDates.map((e, index) => (
                                <div
                                  key={index}
                                  className="p-2 border-2 rounded-md border-blue-200 bg-blue-100"
                                >
                                  <p className="text-center text-sm">
                                    {
                                      //@ts-ignore
                                      e.label.label
                                    }
                                  </p>
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
              </Modal>

              {/* {group.map((item: any) => (
        <div key={item.id} className="item">
          ID: {item.id}, Timestamp: {item.timestamp}
        </div>
      ))} */}
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="flex justify-center mt-10 ">
            <Image
              src={'/trackingOut.png'}
              alt={''}
              width={500}
              height={200}
            ></Image>
          </div>
          <div className="text-center lg:text-3xl text-stone-800">
            Sin recorridos
          </div>
        </>
      )}
    </>
  )
}

UserRound.Layout = Layout

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
