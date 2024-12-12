import React from 'react';
import {
  GoogleMap,
  useLoadScript,
  DrawingManager,
} from '@react-google-maps/api';
import {LATITUDE,LONGITUDE} from '@/utils/constants';

type SectorMapProps = {
  onCoordinatesChange: (coordinates: {lat: number; lng: number}[]) => void;
};

const SectorMap: React.FC<SectorMapProps> = ({onCoordinatesChange}) => {


  const {isLoaded} = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || '',
    libraries: ['drawing'], // Incluye la biblioteca de dibujo
  });

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const handlePolygonComplete = (polygon: google.maps.Polygon) => {
    const path = polygon.getPath();
    const coordinates: {lat: number; lng: number}[] = [];
    for (let i = 0; i < path.getLength(); i++) {
      const point = path.getAt(i);
      coordinates.push({lat: point.lat(),lng: point.lng()});
    }
    onCoordinatesChange(coordinates);
    polygon.setMap(null);
    console.log('=========> coordinates',coordinates);
  };

  return (
    <div className='rounded-lg border border-border-base overflow-hidden'>

      <GoogleMap
        center={{
          lat: LONGITUDE,
          lng: LATITUDE,
        }}
        zoom={12}
        mapContainerStyle={{width: '100%',height: '500px'}}
        onLoad={(map) => {
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
          });
        }}
        children={
          <>
            <DrawingManager
              onPolygonComplete={handlePolygonComplete}
              options={{
                drawingControl: true,
                drawingControlOptions: {
                  position: google.maps.ControlPosition.TOP_CENTER,
                  drawingModes: [google.maps.drawing.OverlayType.POLYGON],
                },
                polygonOptions: {
                  fillColor: 'rgba(0, 123, 255, 0.2)',
                  strokeColor: '#007bff',
                  strokeOpacity: 0.6,
                  strokeWeight: 2,
                  editable: true,
                },
              }}
            />
          </>
        }
      />
    </div>
  );
};

export default SectorMap;
