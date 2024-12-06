import React, { useState } from 'react'
import {
  CircleF,
  GoogleMap,
  Marker,
  MarkerF,
  useLoadScript,
} from '@react-google-maps/api'
import Input from '../ui/input'


type SectorMapProps = {
    onLatLngChange: (latLng: { lat: number; lng: number }) => void; 
  };

const SectorMap: React.FC<SectorMapProps> = ({ onLatLngChange }) => {
    const [latLng, setLatLng] = useState({
    lat: 23.163248731482224,
    lng: -109.71761883295441,
  })

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || '',
  })

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  const onDragEnd = (e: any) => {
    const newLatLng = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    }
    setLatLng(newLatLng) 
    onLatLngChange(newLatLng);

  }

  return (
    <>
      <div className="flex flex-col md:flex-row w-full">
        <div className="w-full md:w-1/2 pr-2 mb-5">
          <Input
            label="Latitud"
            name="latitude"
            variant="outline"
            className="mb-5"
            disabled
            value={latLng.lat}

          />
        </div>

        <div className="w-full md:w-1/2 pl-2 mb-5">
          <Input
            label="Longitud"
            name="longitude"
            variant="outline"
            className="mb-5"
            disabled
            value={latLng.lng}
          />
        </div>
      </div>

      <GoogleMap
        center={latLng}
        zoom={12}
        mapContainerStyle={{ width: '100%', height: '500px' }}
      >
        <MarkerF position={latLng} draggable={true} onDragEnd={onDragEnd} />
        {[30].map((radius, idx) => (
          <CircleF
            key={idx}
            center={latLng}
            radius={radius}
            options={{
              fillColor: 'black',
              strokeColor: 'black',
              strokeOpacity: 0.2,
              fillOpacity: 0.2,
            }}
          />
        ))}
      </GoogleMap>
    </>
  )
}

export default SectorMap
