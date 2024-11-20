/* eslint-disable @typescript-eslint/no-explicit-any */
import React,{useEffect,useState} from 'react'
import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  CircleF,
  GroundOverlay,
  InfoWindowF,
} from '@react-google-maps/api'
import Loader from '@/components/ui/loader/loader'
import Router from 'next/router'
import {Tooltip} from 'react-tooltip'

import {
  useTrackQuerywhitParams,
  useUserQuery,
} from '@/data/user'
import Select from '../select/select'
import {DatePicker} from '../ui/date-picker'
import Image from 'next/image'
import {User} from '@/types/suggestions'
import {addMonths,isBefore,startOfDay} from 'date-fns'
import {capitalizeWords} from '@/utils/functions'
import {useTranslation} from 'react-i18next'
import {es} from 'date-fns/locale'
import {format} from 'date-fns'

const containerStyle = {
  width: '1000px',
  height: '600px',
  borderRadius: '10px',
}

type IProps = {
  latitud: number
  longitud: number
  plano: string
  userId: any
}

const initialMapCenter = {
  lat: 0,
  lng: 0,
}

function MapTrackComponentUserId({latitud,longitud,userId}: IProps) {
  // const mapCenter = useMemo(
  //   () => ({
  //     lat: latitud !== 0 ? latitud : LATITUDE,
  //     lng: longitud !== 0 ? longitud : LONGITUDE,
  //   }),
  //   [latitud, longitud]
  // )

  const [selectStartTimeFormat,setselectStartTimeFormat] = useState<string>('')
  const [selectEndtTimeFormat,setselectEndTimeFormat] = useState<string>('')

  const [selectStartTime,setselectStartTime] = useState<string>('')
  const [selectEndtTime,setselectEndTime] = useState<string>('')

  const [selectedDate,setSelectedDate] = useState(null)

  const [mapCenter,setMapCenter] = useState<{lat: number; lng: number}>(
    initialMapCenter
  )

  const [filteredItems,setFilteredItems] = useState([])

  useEffect(() => {
    setMapCenter({
      lat: latitud,
      lng: longitud,
    })
  },[latitud,longitud])
  // const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
  //   lat: latitud === 0 ? LATITUDE : latitud,
  //   lng: longitud === 0 ? LONGITUDE : longitud,
  // })
  const {id} = Router.query

  const {user} = useUserQuery(id.to)

  const {isLoaded} = useLoadScript({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || '',
  })

  const [map,setMap] = React.useState<any>(null)
  const [selectedOption,setSelectedOption] = useState<string>('')

  const [isCheckedUser,setIsCheckedUser] = useState(false)
  const [historicalOverlay,setHistoricalOverlay] =
    useState<google.maps.GroundOverlay | null>(null)
  const [flightPath,setFlightPath] = useState<google.maps.Polyline | null>(
    null
  )

  const [expiredDocuments,setExpiredDocuments] = useState([])

  const [selectedUser,setSelectedUser] = useState<User | null>(null)

  const imageSize = 0.001

  let imageBounds = {
    north: 0,
    south: 0,
    east: 0,
    west: 0,
  }

  const calculateBounds = (
    lat: number,
    lng: number,
    size: number,
    padding: number
  ) => ({
    north: lat + size / 2 + padding,
    south: lat - size / 2 - padding,
    east: lng + size / 2 + padding,
    west: lng - size / 2 - padding,
  })

  const onLoad = React.useCallback(
    function callback(map: any) {
      const bounds = new window.google.maps.LatLngBounds(mapCenter)
      map.fitBounds(bounds)
      setMap(map)
    },
    [mapCenter]
  )

  const {data} = useTrackQuerywhitParams({
    id: Number(id),
    date: selectedDate ? format(selectedDate,'yyyy-MM-dd') : '',
    startTime: selectStartTimeFormat,
    endTime: selectEndtTimeFormat,
  })

  useEffect(() => {
    if (data) {
      const newFilteredItems = data.map((item: any) => ({
        lat: item.latitude,
        lng: item.longitude,
      }))
      setFilteredItems(newFilteredItems)
    }
  },[data]) // Se ejecuta cada vez que 'data' cambia

  const handleSelectChange = (selectedOption: any) => {
    if (selectedOption) {
      setSelectedOption(selectedOption.value)

      // Eliminar el overlay previo si existe
      if (historicalOverlay) {
        historicalOverlay.setMap(null)
      }

      if (selectedOption.id === 1) {
        const padding = 0.0005
        imageBounds = calculateBounds(23.1626,-109.7176,imageSize,padding) //terminal 1
        setMapCenter({lat: 23.1626,lng: -109.7176})
      } else if (selectedOption.id === 2) {
        const padding = 0.0009
        imageBounds = calculateBounds(23.1569,-109.71673,imageSize,padding) //terminal 2
        setMapCenter({lat: 23.1574,lng: -109.71685})
      } else if (selectedOption.id === 3) {
        // const padding = 0.0006
        // imageBounds = calculateBounds(23.1577, -109.71678, imageSize, padding) //terminal 3
        const padding = 0.0007
        imageBounds = calculateBounds(23.158,-109.7171,imageSize,padding) //terminal 2
        setMapCenter({lat: 23.1568,lng: -109.7169})
      }

      // Crear un nuevo GroundOverlay
      const newHistoricalOverlay = new google.maps.GroundOverlay(
        selectedOption.value, // Asegúrate de usar `selectedOption.value` aquí
        imageBounds
      )
      newHistoricalOverlay.setMap(map)
      setHistoricalOverlay(newHistoricalOverlay)
    } else {
      removeOverlay()
    }
  }

  const removeOverlay = () => {
    if (historicalOverlay) {
      historicalOverlay.setMap(null)
    }
    setSelectedOption('')
  }

  const removePolyline = () => {
    if (flightPath) {
      flightPath.setMap(null)
    }
    setFlightPath(null)
  }

  const handleChangeStart = (date) => {
    if (date) {
      const formattedTime = date.toTimeString().split(' ')[0] // Obtiene HH:mm:ss
      setselectStartTimeFormat(formattedTime)
    }
    setselectStartTime(date)
  }

  const handleChangeEnd = (date) => {
    if (date) {
      const formattedTime = date.toTimeString().split(' ')[0] // Obtiene HH:mm:ss
      setselectEndTimeFormat(formattedTime)
      setDisabaled(false)
    }
    setselectEndTime(date)
    setDisabaled(false)
  }

  const handleToggleUser = () => {
    // if (data && data.length > 0) {
    //   const filteredItems = data.map((item) => ({
    //     lat: item.latitude,
    //     lng: item.longitude,
    //   }))

    setIsCheckedUser(!isCheckedUser)

    if (!isCheckedUser) {
      setDisabaledDateEnd(true)
      const flightPath = new google.maps.Polyline({
        path: filteredItems,
        strokeColor: '#2480c5',
        strokeOpacity: 1.0,
        strokeWeight: 2,
      })
      flightPath.setMap(map)
      setFlightPath(flightPath)
    } else {
      removePolyline()
      setDisabaledDateEnd(false)
    }

    // if (filteredItems.length > 0) {
    //   setDisabaledDateEnd(true)
    //   const flightPath = new google.maps.Polyline({
    //     path: filteredItems,
    //     strokeColor: '#2480c5',
    //     strokeOpacity: 1.0,
    //     strokeWeight: 2,
    //   })
    //   flightPath.setMap(map)
    //   setFlightPath(flightPath)
    // } else if (isCheckedUser === false) {
    //   removePolyline()
    //   setDisabaledDateEnd(false)
    // }
    // }
  }

  const onUnmount = React.useCallback(
    function callback(map: any) {
      setMap(null)
      if (flightPath) {
        flightPath.setMap(null)
      }
    },
    [flightPath]
  )

  const handleDateChange = (date: any) => {
    if (date) {
      setSelectedDate(date)
      setDisabaledDateEnd(false)
    } else {
      setSelectedDate(null)
      setDisabaledDateEnd(true)
    }
  }

  const handleDateEndChange = (date: any) => {
    if (date) {
      setSelectedDateEnd(date)
      setDisabaled(false)
      setDisabaledDate(true)
    } else {
      setSelectedDateEnd(null)
      setDisabaled(true)
    }
  }

  function filterByDate(
    trackingItems: any[],
    targetDateStart: string,
    targetDateEnd: string
  ) {
    const startDate = new Date(targetDateStart + 'Z')
    startDate.setHours(startDate.getHours() + 6)

    const startDateIso = startDate.toISOString()

    const endDate = new Date(targetDateEnd + 'Z')
    endDate.setHours(endDate.getHours() + 6)

    const endDateIso = endDate.toISOString()

    return trackingItems
      ?.filter((item: any) => {
        const itemDate = new Date(item.createdAt).toISOString()

        return itemDate >= startDateIso && itemDate <= endDateIso
      })
      .map((item: any) => ({
        lat: item.latitude,
        lng: item.longitude,
      }))
  }

  const [showInfoWindow,setShowInfoWindow] = useState(false)

  const userDetails = (id: any) => {
    Router.push('/users/' + id)
  }

  const categorizeDocuments = (documents: any) => {
    const now = new Date() // Fecha actual
    const oneMonthFromNow = addMonths(startOfDay(now),1)
    const expiredDocuments: any[] = []
    const soonToExpireDocuments: any[] = []

    documents?.forEach((document: any) => {
      const validUntilDate = startOfDay(new Date(document.validUntil))

      if (isBefore(validUntilDate,now)) {
        expiredDocuments.push(document)
      } else if (isBefore(validUntilDate,oneMonthFromNow)) {
        soonToExpireDocuments.push(document)
      }
    })

    return {expiredDocuments,soonToExpireDocuments}
  }

  const handleMarkerClick = (user: any) => {
    setSelectedUser(user)

    const {expiredDocuments,soonToExpireDocuments} = categorizeDocuments(
      user?.documents
    )

    setExpiredDocuments(expiredDocuments)
    setSoonToExpireDocuments(soonToExpireDocuments)
  }

  return isLoaded ? (
    <>
      <div className="border-2"></div>
      {/* <div className="flex items-center">
        <Select
          className="md:w-1/2 my-7"
          onChange={handleSelectChange}
          isClearable
          options={[
            {
              id: 1,
              label: 'Terminal 1',
              value: '/terminal_1.jpeg',
            },
            {
              id: 2,
              label: 'Terminal 2 piso 1',
              value: '/terminal_2_1.jpeg',
            },
            {
              id: 3,
              label: 'Terminal 2 piso 2',
              value: '/terminal_2.jpeg',
            },
          ]}
          getOptionLabel={(option: any) => option.label}
          getOptionValue={(option: any) => option.value}
          name={'selectOption'}
        />

        <div className="md:-1/2 ml-5">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => handleDateChange(date)}
            showTimeSelect
            timeIntervals={30}
            timeFormat="HH:mm"
            dateFormat="dd/MM/yyyy HH:mm"
            placeholderText="Selecciona una fecha y hora de inicio"
          />
        </div>

        <div className="md:w-1/2 ml-5">
          <DatePicker
            selected={selectedDateEnd}
            onChange={(date) => handleDateEndChange(date)}
            showTimeSelect
            disabled={disabledDateEnd}
            timeIntervals={1}
            timeFormat="HH:mm"
            dateFormat="dd/MM/yyyy HH:mm"
            placeholderText="Selecciona una fecha y hora de fin"
          />
        </div>

        <div className="mx-5">
          <label className="inline-flex items-center cursor-pointer">
            <input
              disabled={disabled}
              type="checkbox"
              value=""
              className="sr-only peer"
              onChange={handleToggleUser}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900  ">
              <p className="text-black"></p>
            </span>
          </label>
        </div>
      </div> */}

      <div className="flex flex-col md:flex-row items-center md:space-x-5 space-y-5 md:space-y-0 my-4">
        <Select
          className="md:w-1/2 w-full"
          onChange={handleSelectChange}
          isClearable
          options={[
            {
              id: 1,
              label: 'Terminal 1',
              value: '/terminal_1.jpeg',
            },
            {
              id: 2,
              label: 'Terminal 2 piso 1',
              value: '/terminal_2_1_1.jpeg',
            },
            {
              id: 3,
              label: 'Terminal 2 piso 2',
              value: '/terminal_2_2.jpeg',
            },
          ]}
          getOptionLabel={(option: any) => option.label}
          getOptionValue={(option: any) => option.value}
          name={'selectOption'}
        />

        <div className="md:w-1/2 w-full">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => handleDateChange(date)}
            // showTimeSelect
            timeIntervals={30}
            // timeFormat="HH:mm"
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecciona una fecha y hora de inicio"
            className="w-full"
            locale={es}
          />
        </div>

        <div className="md:w-1/4 w-full">
          {/* <DatePicker
            selected={selectedDateEnd}
            onChange={(date) => handleDateEndChange(date)}
            showTimeSelect
            disabled={disabledDateEnd}
            timeIntervals={1}
            timeFormat="HH:mm"
            dateFormat="dd/MM/yyyy HH:mm"
            placeholderText="Selecciona una fecha y hora de fin"
            className="w-full"
          /> */}

          <DatePicker
            selected={selectStartTime}
            onChange={handleChangeStart}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={1}
            timeCaption="Tiempo"
            dateFormat="h:mm aa"
            placeholderText="Hora inicial"
            isClearable
          />
        </div>

        <div className="md:w-1/4 w-full">
          {/* <DatePicker
            selected={selectedDateEnd}
            onChange={(date) => handleDateEndChange(date)}
            showTimeSelect
            disabled={disabledDateEnd}
            timeIntervals={1}
            timeFormat="HH:mm"
            dateFormat="dd/MM/yyyy HH:mm"
            placeholderText="Selecciona una fecha y hora de fin"
            className="w-full"
          /> */}

          <DatePicker
            selected={selectEndtTime}
            onChange={handleChangeEnd}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={1}
            timeCaption="Tiempo"
            dateFormat="h:mm aa"
            placeholderText="Hora final"
            isClearable={true}
          />
        </div>

        <div
          className="w-full md:w-auto"
          data-tooltip-id="my-tooltip"
          data-tooltip-content="No existe recorrido con esa fecha."
          data-tooltip-place="top"
        >
          <label className="inline-flex items-center cursor-pointer">
            <input
              disabled={filteredItems.length > 0 ? false : true}
              type="checkbox"
              value=""
              className="sr-only peer"
              onChange={handleToggleUser}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900">
              <p className="text-black"></p>
            </span>
          </label>
        </div>
      </div>
      {filteredItems.length === 0 ? <Tooltip id="my-tooltip" /> : null}

      <GoogleMap
        mapContainerStyle={containerStyle}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        zoom={7}
        onLoad={onLoad}
        onUnmount={onUnmount}
        center={mapCenter}
      >
        {userId !== 0 ? (
          <>
            <MarkerF
              icon={{
                //@ts-ignore
                url: '/' + user?.icon,
                scaledSize: new window.google.maps.Size(48,48),
              }}
              //@ts-ignore
              onClick={() => handleMarkerClick(user)}
              position={{lat: latitud,lng: longitud}}
              onLoad={() => console.log('Marker Loaded')}
            />
            <>
              {selectedUser && (
                <InfoWindowF
                  position={{
                    lat: latitud,
                    lng: longitud,
                  }}
                  onCloseClick={() => setSelectedUser(null)}
                >
                  <div className="w-[20em] ">
                    <div
                      className={`flex p-3 rounded-md ${selectedUser.documents.length ===
                        selectedUser.jobPosition.requireDocuments.length &&
                        expiredDocuments.length === 0
                        ? 'bg-green-100'
                        : 'bg-yellow-100'
                        }`}
                    >
                      <Image
                        className="rounded-full"
                        src={selectedUser.image}
                        alt={'Imagen'}
                        width={50}
                        height={30}
                      />
                      <div className="block ml-3">
                        <p className="font-bold">
                          {capitalizeWords(
                            selectedUser.firstName + ' ' + selectedUser.lastName
                          )}
                        </p>
                        <div>
                          <p>
                            {' '}
                            <strong>Documentos:</strong>{' '}
                            {selectedUser.documents.length}
                          </p>
                        </div>

                        <span
                          onClick={() => {
                            userDetails(selectedUser.id)
                          }}
                          className="text-blue-500 underline hover:text-blue-700 hover:cursor-pointer"
                        >
                          Ir a perfil
                        </span>
                      </div>
                    </div>

                  </div>
                </InfoWindowF>
              )}

              {[0.3,0.01].map((radius,idx) => (
                <CircleF
                  key={idx}
                  center={{lat: latitud,lng: longitud}}
                  radius={radius}
                  options={{
                    fillColor:
                      user?.documents.length ===
                        user?.jobPosition?.requireDocuments.length
                        ? 'green'
                        : 'yellow',
                    strokeOpacity: 0.2,
                  }}
                />
              ))}
            </>
          </>
        ) : null}

        <GroundOverlay bounds={imageBounds} url={selectedOption} />
      </GoogleMap>
    </>
  ) : (
    <Loader />
  )
}

export default React.memo(MapTrackComponentUserId)
