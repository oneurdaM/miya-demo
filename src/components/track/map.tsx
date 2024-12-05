import React, { useEffect, useState, useCallback } from 'react'
import Router from 'next/router'

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

const containerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '10px',
}

type MapTrackProps = {
  sectores: any
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

function MapTrackComponent({
  defaultLat,
  defaultLng,
  users,
  sectores,
}: MapTrackProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || '',
  })

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
  const [sectorMarker, setSectorMarker] = useState<google.maps.Marker | null>(null)

  //#endregion Funciones de carga
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

  function pruebaCuadrado() {
    const center = sectores.location 

    const displacement = 0.00022 

    const angleDegrees = sectores.rotation
    const angleRadians = angleDegrees * (Math.PI / 180) // Convertimos a radianes

    const squareCoords = [
      { lat: center.lat + displacement, lng: center.lng - displacement }, // Vértice 1: Noreste
      { lat: center.lat + displacement, lng: center.lng + displacement }, // Vértice 2: Noroeste
      { lat: center.lat - displacement, lng: center.lng + displacement }, // Vértice 3: Suroeste
      { lat: center.lat - displacement, lng: center.lng - displacement }, // Vértice 4: Sureste
    ]

    function rotatePoint(point: any, center: any, angleRadians: any) {
      const dx = point.lng - center.lng // Diferencia en longitud
      const dy = point.lat - center.lat // Diferencia en latitud

      const newLng =
        center.lng + (dx * Math.cos(angleRadians) - dy * Math.sin(angleRadians))
      const newLat =
        center.lat + (dx * Math.sin(angleRadians) + dy * Math.cos(angleRadians))

      return { lat: newLat, lng: newLng }
    }

    const rotatedSquareCoords = squareCoords.map((vertex) =>
      rotatePoint(vertex, center, angleRadians)
    )

    return rotatedSquareCoords
  }
  
  function generarCircunferencia() {
    const center = sectores.location; // Centro de la circunferencia
    const radius = 0.00022; // Radio de la circunferencia (en unidades de lat/lng)
    const numPoints = 200; // Cantidad de puntos para aproximar la circunferencia (mayor = más suave)
    const angleOffsetDegrees = sectores.rotation; // Ángulo inicial de rotación (en grados)
  
    // Convertir el ángulo de rotación a radianes
    const angleOffsetRadians = angleOffsetDegrees * (Math.PI / 180);
  
    // Generar los puntos de la circunferencia
    const circleCoords = [];
    for (let i = 0; i < numPoints; i++) {
      const angle = (i * (2 * Math.PI)) / numPoints + angleOffsetRadians; // Ángulo para cada punto
      const lat = center.lat + radius * Math.cos(angle);
      const lng = center.lng + radius * Math.sin(angle);
  
      circleCoords.push({ lat, lng });
    }
  
    return circleCoords;
  }


  const handleTogglePolygon = () => {
    if (polygon) {
      polygon.setMap(null); 
      setPolygon(null);
  
      // Elimina el marcador asociado
      if (sectorMarker) {
        sectorMarker.setMap(null);
        setSectorMarker(null);
      }
    } else {
      const circleCoords = generarCircunferencia();

      console.log(circleCoords)
  
      const newPolygon = new google.maps.Polygon({
        paths: circleCoords,
        strokeColor: sectores.color,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: sectores.color,
        fillOpacity: 0.3,
      });
  
      newPolygon.setMap(map); 
      setPolygon(newPolygon);
  
      // Crea el marcador asociado
      createMarker(map, sectores.location);
    }
  };

  //#endregion

  useEffect(() => {
    if (sectores) {
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
    if (polygon) {
      polygon.setMap(null)
    }
    setPolygon(null)
  }

  const createMarker = (map: google.maps.Map, position: { lat: number; lng: number }) => {
    // Elimina el marcador existente si hay uno
    if (sectorMarker) {
      sectorMarker.setMap(null); // Remueve el marcador del mapa
    }
  
    const newMarker = new google.maps.Marker({
      position,
      map, // Asocia el marcador al mapa existente
      title: 'Centro del Polígono',
    });
  
    // Opcional: Agrega un evento al marcador
    newMarker.addListener('click', handlePolygonClick);
  
    // Guarda el nuevo marcador en el estado
    setSectorMarker(newMarker);
  
    return newMarker; // Devuelve el marcador si necesitas usarlo
  };

  return isLoaded ? (
    <>
      <Select
        className="w-full my-7"
        onChange={handleSelectChange}
        isClearable
        options={[
          { id: 1, label: 'Terminal 1', value: '/terminal_1.jpeg' },
          { id: 2, label: 'Terminal 2 Piso 1', value: '/terminal_2_1.jpeg' },
          { id: 3, label: 'Terminal 2 Piso 2', value: '/terminal_2_2.jpeg' },
        ]}
        getOptionLabel={(option: any) => option.label}
        getOptionValue={(option: any) => option.value}
        name={'selectOption'}
      />
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
                <Image
                  className="rounded-full"
                  src={selectedUser?.image}
                  alt={'Imagen'}
                  width={50}
                  height={30}
                />
                <div className="block ml-3">
                  <p className="font-bold">
                    {capitalizeWords(selectedUser.user?.name)}
                  </p>
                  <p>{selectedUser?.jobposition}</p>
                  <div>
                    <p>
                      <strong>Documentos:</strong>{' '}
                      {selectedUser?.documents?.length}
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
            position={{
              lat: Number(selectedSEctor.location.lat),
              lng: Number(selectedSEctor.location.lng),
            }}
            onCloseClick={() => setSelectedUSector(null)}
          >
            <div className="w-[20em] ">

              <div className={` ${sectores.color} p-5 rounded-md`}>

              </div>
         
              <p className='text-center text-lg font-bold'> Ubicación: {selectedSEctor.name}</p>
              <p>Cantidad de usuarios en la Ubicación: <strong>{sectores.userCont}</strong>  </p>
              <br />
              <p>Con una expansión aproximada de <strong>48.14 metros</strong>  </p>
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
