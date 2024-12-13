import React, { useState, useEffect } from 'react'
import {
  GoogleMap,
  useLoadScript,
  DrawingManager,
} from '@react-google-maps/api'
import { LATITUDE, LONGITUDE } from '@/utils/constants'
import Loader from '../ui/loader/loader'

type SectorMapProps = {
  onCoordinatesChange: (coordinates: { lat: number; lng: number }[]) => void
  coordinates?: { lat: number; lng: number }[]
}

const polygonOptions = {
  fillColor: '#FF0000',
  fillOpacity: 0.5,
  strokeColor: '#FF0000',
  strokeWeight: 2,
  editable: true,
}

const SectorMap: React.FC<SectorMapProps> = ({
  onCoordinatesChange,
  coordinates,
}) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || '',
    libraries: ['drawing'],
  })
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null)
  const [polygon, setPolygon] = useState<google.maps.Polygon | null>(null)

  const updateCoordinates = (polygon: google.maps.Polygon) => {
    const path = polygon.getPath()
    const newCoordinates: { lat: number; lng: number }[] = []
    for (let i = 0; i < path.getLength(); i++) {
      const point = path.getAt(i)
      newCoordinates.push({ lat: point.lat(), lng: point.lng() })
    }
    onCoordinatesChange(newCoordinates)
  }

  const handlePolygonComplete = (completedPolygon: google.maps.Polygon) => {
    setPolygon(completedPolygon)
    updateCoordinates(completedPolygon)

    google.maps.event.addListener(completedPolygon.getPath(), 'set_at', () =>
      updateCoordinates(completedPolygon)
    )
    google.maps.event.addListener(completedPolygon.getPath(), 'insert_at', () =>
      updateCoordinates(completedPolygon)
    )
    google.maps.event.addListener(completedPolygon.getPath(), 'remove_at', () =>
      updateCoordinates(completedPolygon)
    )
  }

  const createPolygon = (
    map: google.maps.Map,
    coordinates: { lat: number; lng: number }[],
    options: google.maps.PolygonOptions
  ) => {
    if (polygon) {
      polygon.setMap(null)
    }

    const polygonCoordinates = Object.values(coordinates)

    const newPolygon = new google.maps.Polygon({
      ...options,
      paths: polygonCoordinates,
      map,
    })

    setPolygon(newPolygon)

    google.maps.event.addListener(newPolygon.getPath(), 'set_at', () =>
      updateCoordinates(newPolygon)
    )
    google.maps.event.addListener(newPolygon.getPath(), 'insert_at', () =>
      updateCoordinates(newPolygon)
    )
    google.maps.event.addListener(newPolygon.getPath(), 'remove_at', () =>
      updateCoordinates(newPolygon)
    )
  }

  useEffect(() => {
    if (mapInstance && coordinates) {
      console.log('Creating polygon with coordinates:', coordinates)
      createPolygon(mapInstance, coordinates, polygonOptions)
    }
  }, [mapInstance, coordinates])

  useEffect(() => {
    if (mapInstance) {
      const drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: !coordinates || coordinates.length === 0,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [google.maps.drawing.OverlayType.POLYGON],
        },
        polygonOptions: polygonOptions,
      })

      drawingManager.setMap(mapInstance)
      google.maps.event.addListener(
        drawingManager,
        'polygoncomplete',
        handlePolygonComplete
      )

      return () => {
        google.maps.event.clearListeners(drawingManager, 'polygoncomplete')
        drawingManager.setMap(null)
      }
    }
  }, [mapInstance])

  return (
    <div className="rounded-lg border border-border-base overflow-hidden">
      {isLoaded ? (
        <GoogleMap
          center={{
            lat: LATITUDE,
            lng: LONGITUDE,
          }}
          zoom={12}
          mapContainerStyle={{ width: '100%', height: '500px' }}
          onLoad={(map) => {
            setMapInstance(map)
            map.setOptions({
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: true,
              rotateControl: false,
              scaleControl: false,
              zoomControl: true,
              panControl: false,
              gestureHandling: 'greedy',
              mapTypeId: google.maps.MapTypeId.ROADMAP,
            })
          }}
        />
      ) : (
        <Loader />
      )}
    </div>
  )
}

export default SectorMap
