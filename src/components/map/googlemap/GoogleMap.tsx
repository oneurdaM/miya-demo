import { useLoadScript, GoogleMap, MarkerF } from '@react-google-maps/api'

import Map from '../Map'
// import Marker from '@/components/map/custom/custom-marker'
import { Alert } from '@/types/alerts'
import { useMemo } from 'react'
import Loader from '@/components/ui/loader/loader'

export default function GoogleMapView({
  apiKey,
  onClick,
  onIdle,
  zoom,
  center,
  markers,
  onMarkerClick,
  highlightedMarkerId,
  marker,
}: any) {
  const libraries = useMemo(() => ['places'], [])
  const mapCenter = useMemo(
    () => ({ lat: marker.latitude, lng: marker.longitude }),
    []
  )

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: false,
    }),
    []
  )

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: libraries as any,
  })

  if (!isLoaded) {
    return <Loader />
  }

  return (
    <div className="flex h-full">
      <GoogleMap
        options={mapOptions}
        zoom={14}
        center={mapCenter}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width: '1200px', height: '800px' }}
        onLoad={() => console.log('On load')}
      >
        <MarkerF
          position={mapCenter}
          onLoad={() => console.log('Marker Loaded')}
        />
      </GoogleMap>
    </div>
  )
}
