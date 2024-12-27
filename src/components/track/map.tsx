import React, { useEffect, useState, useCallback } from 'react'
import Router, { useRouter } from 'next/router'

import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindowF,
  Polygon,
} from '@react-google-maps/api'
import { addMonths, isBefore, startOfDay } from 'date-fns'

import Loader from '@/components/ui/loader/loader'
import Image from 'next/image'
import { capitalizeWords } from '@/utils/functions'
import Select from '../select/select'
import Avatar from '../common/avatar'
import { useTranslation } from 'react-i18next'
import { useSocketContext } from '@/contexts/socket.context'
import { UsersResponse } from '@/types/users'
import { useJobPositionQuery } from '@/data/job-position'
import { siteSettings } from '@/settings/site.settings'

const containerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '10px',
}

type MapTrackProps = {
  sectores: any
  jobpositionFilter: any
  defaultLat: number
  defaultLng: number
  users: Array<{
    email: string
    firstName: string
    lastName: string
    role: string
    icon: string
    location: {
      latitude: number
      longitude: number
      lastUpdate?: string
    }
  }>
}

const polygonOptions = {
  fillColor: '#FF0000',
  fillOpacity: 0.5,
  strokeColor: '#FF0000',
  strokeWeight: 2,
  editable: false,
}

function MapTrackComponent({
  defaultLat,
  defaultLng,
  users,
  sectores,
  jobpositionFilter,
}: MapTrackProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || '',
  })
  const router = useRouter()
  const { t } = useTranslation()
  const [userFilter, setUserFilter] = useState<UsersResponse[]>([])
  const [formattedJobposition, setFormattedJobposition] = useState([])
  const [searchJob, setSearchJob] = useState<string | null>(null)
  const { all_users, online_users } = useSocketContext()
  const { jobposition } = useJobPositionQuery()

  const [map, setMap] = useState<any>(null)
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: defaultLat,
    lng: defaultLng,
  })
  const [selectedSEctor, setSelectedUSector] = useState<any>(null)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [historicalOverlay, setHistoricalOverlay] =
    useState<google.maps.GroundOverlay | null>(null)
  const [selectedOption, setSelectedOption] = useState<string>('')
  const imageSize = 0.001

  const [polygon, setPolygon] = useState<google.maps.Polygon | null>(null)
  const [sectorMarker, setSectorMarker] = useState<google.maps.Marker | null>(
    null
  )

  const [centerPolygon, setCenterPolygon] = useState<{
    lat: number
    lng: number
  }>({
    lat: defaultLat,
    lng: defaultLng,
  })

  useEffect(() => {
    if (searchJob) {
      const filteredUsers = all_users?.filter((user) => {
        return user?.jobPosition?.name === searchJob
      })

      if (filteredUsers) setUserFilter(filteredUsers)
    } else {
      setUserFilter([])
    }
  }, [searchJob, all_users])

  function handleSelect(value: any) {
    jobpositionFilter(value ? value.label : '')
  }

  useEffect(() => {
    if (Array.isArray(jobposition)) {
      const formatted: any = jobposition.map((doc: any) => ({
        label: capitalizeWords(doc.name),
        value: doc.id,
      }))
      setFormattedJobposition(formatted)
    }
  }, [jobposition])

  const onLoad = useCallback(
    (map: any) => {
      setMap(map)
      if (users && users.length > 0) {
        const bounds = new window.google.maps.LatLngBounds()
        users.forEach((user) =>
          bounds.extend({
            lat: user.location.latitude,
            lng: user.location.longitude,
          })
        )
        map.fitBounds(bounds)
      }
    },
    [users]
  )

  const handleTogglePolygon = () => {
    const polygonCoordinates = Object.values(sectores.coordinates)
    createPolygon(map, polygonCoordinates, polygonOptions)
  }

  const calculatePolygonCenter = (
    coordinates: { lat: number; lng: number }[]
  ) => {
    const totalPoints = coordinates.length
    const sumLat = coordinates.reduce((sum, coord) => sum + coord.lat, 0)
    const sumLng = coordinates.reduce((sum, coord) => sum + coord.lng, 0)

    const centerLat = sumLat / totalPoints
    const centerLng = sumLng / totalPoints

    return { lat: centerLat, lng: centerLng }
  }

  useEffect(() => {
    if (sectores === null) {
      removePolyline()
    } else {
      handleTogglePolygon()
    }
  }, [sectores])

  const handlePolygonClick = (e: any) => {
    setSelectedUSector(sectores)
  }

  const handleMarkerClick = (user: any) => {
    setSelectedUser(user)
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
  console.log(users)
  const userDetails = (id: any) => {
    Router.push('/users/' + id)
  }

  const handleSelectChange = (selectedOption: any) => {
    if (selectedOption) {
      setSelectedOption(selectedOption.value)

      if (historicalOverlay) {
        historicalOverlay.setMap(null)
      }

      let imageBounds: any
      if (selectedOption.id === 1) {
        const padding = 0.0005
        imageBounds = calculateBounds(23.1626, -109.7176, imageSize, padding) // Terminal 1
        setMapCenter({ lat: 23.1626, lng: -109.7176 })
      } else if (selectedOption.id === 2) {
        const padding = 0.0009
        imageBounds = calculateBounds(23.1569, -109.71673, imageSize, padding) // Terminal 2 Piso 1
        setMapCenter({ lat: 23.1574, lng: -109.71685 })
      } else if (selectedOption.id === 3) {
        const padding = 0.0007
        imageBounds = calculateBounds(23.158, -109.7171, imageSize, padding) // Terminal 2 Piso 2
        setMapCenter({ lat: 23.1568, lng: -109.7169 })
      }

      const newHistoricalOverlay = new google.maps.GroundOverlay(
        selectedOption.value,
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
    if (polygon && sectorMarker) {
      polygon.setMap(null)
      sectorMarker.setMap(null)
      setPolygon(null)
    }
  }

  const createPolygon = (
    map: google.maps.Map,
    coordinates: any,
    polygonOptions: google.maps.PolygonOptions
  ) => {
    if (sectorMarker) {
      sectorMarker.setMap(null)
    }

    const center = calculatePolygonCenter(coordinates)
    setCenterPolygon(center)

    const newMarker = new google.maps.Marker({
      position: center,
      map,
      title: 'Centro del Polígono',
    })

    const newPolygon = new google.maps.Polygon({
      ...polygonOptions,
      paths: coordinates,
      map,
    })

    newMarker.addListener('click', handlePolygonClick)

    // newPolygon.addListener('click', handlePolygonClick)

    setPolygon(newPolygon)
    setSectorMarker(newMarker)

    return { polygon: newPolygon, newMarker }
  }

  return isLoaded ? (
    <>
      <div className="flex w-full justify-between items-center mb-4 gap-2">
        {/* Primer Select: Selector de planos */}
        <div className="w-1/2">
          <label className="text-stone-600">Planos del aeropuerto</label>
          <Select
            className="flex-1"
            onChange={handleSelectChange}
            isClearable
            options={[
              { id: 1, label: 'Terminal 1', value: '/terminal_1.jpeg' },
              {
                id: 2,
                label: 'Terminal 2 Piso 1',
                value: '/terminal_2_1.jpeg',
              },
              {
                id: 3,
                label: 'Terminal 2 Piso 2',
                value: '/terminal_2_2.jpeg',
              },
            ]}
            getOptionLabel={(option: any) => option.label}
            getOptionValue={(option: any) => option.value}
            name={'selectOption'}
            placeholder="Selecciona el plano"
          />
        </div>
        {/* Segundo Select: Selector de posiciones */}
        <div className="w-1/2">
          <label className="text-stone-600">Posiciones de trabajo</label>
          <Select
            getOptionValue={(option: any) => option.value}
            getOptionLabel={(option: any) => option.label}
            options={formattedJobposition ?? []}
            isMulti={false}
            className="flex-1"
            isClearable
            placeholder="Selecciona la posición"
            onChange={handleSelect}
          />
        </div>
      </div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={14}
        onLoad={onLoad}
      >
        {users?.map((user, index) => (
          <MarkerF
            key={index}
            position={{
              lat: user.location?.latitude,
              lng: user.location?.longitude,
            }}
            icon={{
              url: user?.icon || '/default-marker.png',
              scaledSize: new window.google.maps.Size(40, 40),
            }}
            onClick={() => handleMarkerClick(user)}
          />
        ))}
        {selectedUser && (
          <InfoWindowF
            position={{
              lat: Number(selectedUser.location.latitude),
              lng: Number(selectedUser.location.longitude),
            }}
            onCloseClick={() => setSelectedUser(null)}
          >
            <div className="w-[20em] ">
              <div className={`flex p-3 rounded-md bg-green-100 text-gray-800`}>
                {selectedUser?.image ? (
                  <Image
                    className="rounded-full"
                    src={selectedUser?.image}
                    alt={'Imagen'}
                    width={50}
                    height={30}
                  />
                ) : (
                  <Avatar
                    src={siteSettings?.avatar?.placeholder}
                    name={selectedUser?.firstName as string}
                  />
                )}
                <div className="block ml-3">
                  <p className="font-bold">
                    {capitalizeWords(
                      selectedUser?.firstName + ' ' + selectedUser?.lastName
                    )}
                  </p>
                  <p>{selectedUser?.jobposition}</p>
                  <div>
                    <p>
                      <strong>Documentos: </strong>
                      {selectedUser?.expiredDocuments?.length +
                        selectedUser?.expiringDocuments?.length}
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

              <div className=" p-3 rounded-md mt-3 bg-blue-100 text-gray-800">
                <span className="font-bold text-sm">
                  {selectedUser?.expiringDocuments.length > 0
                    ? 'Documentos por vencer:'
                    : 'Sin Documentos por vencer'}
                </span>
                {selectedUser?.expiringDocuments.map((document: any) => (
                  <div className="block text-center">
                    <span>{document.name}</span>
                  </div>
                ))}
              </div>

              <div className=" p-3 rounded-md mt-3 bg-red-100 text-gray-800">
                <span className="font-bold text-sm">
                  {selectedUser?.expiringDocuments.length > 0
                    ? 'Documentos vencidos:'
                    : 'Sin Documentos vencidos'}
                </span>
                {selectedUser?.expiredDocuments?.map((document: any) => (
                  <div className="block text-center">
                    <span>{document?.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </InfoWindowF>
        )}

        {selectedSEctor && (
          <InfoWindowF
            position={centerPolygon}
            onCloseClick={() => setSelectedUSector(null)}
          >
            <div className="w-[20em] ">
              <p className="text-center text-lg font-bold">
                Ubicación: {selectedSEctor.name}
              </p>
              <p>
                Cantidad de usuarios en la Ubicación:
                <strong>{sectores?.user.length}</strong>
              </p>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>
    </>
  ) : (
    <Loader />
  )
}

export default React.memo(MapTrackComponent)
