import React,{useEffect,useState,useCallback} from 'react';
import Router from 'next/router'

import {
  GoogleMap,
  useLoadScript,
  MarkerF,
  InfoWindowF,
} from '@react-google-maps/api';
import {addMonths,isBefore,startOfDay} from 'date-fns'

import Loader from '@/components/ui/loader/loader';
import Image from 'next/image';
import {capitalizeWords} from '@/utils/functions';
import Select from '../select/select';

const containerStyle = {
  width: '100%',
  height: '600px',
  borderRadius: '10px',
};

type MapTrackProps = {
  defaultLat: number;
  defaultLng: number;
  users: Array<{
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    icon: string;
    location: {
      latitude: number;
      longitude: number;
      lastUpdate?: string
    };
  }>;
};

function MapTrackComponent({defaultLat,defaultLng,users}: MapTrackProps) {
  const {isLoaded} = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || '',
  });
  const [map,setMap] = useState<any>(null)
  const [expiredDocuments,setExpiredDocuments] = useState([])
  const [soonToExpireDocuments,setSoonToExpireDocuments] = useState([])

  const [mapCenter,setMapCenter] = useState<{lat: number; lng: number}>({
    lat: defaultLat,
    lng: defaultLng,
  });
  const categorizeDocuments = (documents: any) => {
    const now = new Date() // Fecha actual
    const oneMonthFromNow = addMonths(startOfDay(now),1)
    const expiredDocuments: any = []
    const soonToExpireDocuments: any = []

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

  const [selectedUser,setSelectedUser] = useState<any>(null);
  const [historicalOverlay,setHistoricalOverlay] =
    useState<google.maps.GroundOverlay | null>(null);
  const [selectedOption,setSelectedOption] = useState<string>('');
  const imageSize = 0.001;

  const onLoad = useCallback(
    (map: any) => {
      if (users && users.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        users.forEach((user) =>
          bounds.extend({lat: user.location.latitude,lng: user.location.longitude})
        );
        map.fitBounds(bounds);
      }
    },
    [users]
  );

  const handleMarkerClick = (user: any) => {
    setSelectedUser(user);
  };

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
  });

  const userDetails = (id: any) => {
    Router.push('/users/' + id)
  }

  const handleSelectChange = (selectedOption: any) => {
    if (selectedOption) {
      setSelectedOption(selectedOption.value);

      // Eliminar el overlay previo si existe
      if (historicalOverlay) {
        historicalOverlay.setMap(null);
      }

      let imageBounds: any;
      if (selectedOption.id === 1) {
        const padding = 0.0005;
        imageBounds = calculateBounds(23.1626,-109.7176,imageSize,padding); // Terminal 1
        setMapCenter({lat: 23.1626,lng: -109.7176});
      } else if (selectedOption.id === 2) {
        const padding = 0.0009;
        imageBounds = calculateBounds(23.1569,-109.71673,imageSize,padding); // Terminal 2 Piso 1
        setMapCenter({lat: 23.1574,lng: -109.71685});
      } else if (selectedOption.id === 3) {
        const padding = 0.0007;
        imageBounds = calculateBounds(23.158,-109.7171,imageSize,padding); // Terminal 2 Piso 2
        setMapCenter({lat: 23.1568,lng: -109.7169});
      }

      const newHistoricalOverlay = new google.maps.GroundOverlay(
        selectedOption.value,
        imageBounds
      );

      // Asignar el mapa en lugar del overlay
      newHistoricalOverlay.setMap(map);
      setHistoricalOverlay(newHistoricalOverlay);
    } else {
      removeOverlay();
    }
  };


  const removeOverlay = () => {
    if (historicalOverlay) {
      historicalOverlay.setMap(null);
    }
    setSelectedOption('');
  };

  useEffect(() => {
    if (users?.length > 0) {
      setMapCenter({lat: users[0]?.location?.latitude,lng: users[0].location?.longitude});
    }
  },[users]);

  return isLoaded ? (
    <>
      <Select
        className="w-full my-7"
        onChange={handleSelectChange}
        isClearable
        options={[
          {id: 1,label: 'Terminal 1',value: '/terminal_1.jpeg'},
          {id: 2,label: 'Terminal 2 Piso 1',value: '/terminal_2_1.jpeg'},
          {id: 3,label: 'Terminal 2 Piso 2',value: '/terminal_2_2.jpeg'},
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
        {/* Renderizar marcadores de usuarios */}
        {users?.map((user,index) => (
          <MarkerF
            key={index}
            position={{lat: user.location?.latitude,lng: user.location?.longitude}}
            icon={{
              url: user?.icon || '/default-marker.png',
              scaledSize: new window.google.maps.Size(40,40),
            }}
            onClick={() => handleMarkerClick(user)}
          />
        ))}
        {/* Mostrar información del usuario seleccionado */}
        {selectedUser && (
          <InfoWindowF
            position={{
              lat: Number(selectedUser.latitude),
              lng: Number(selectedUser.longitude),
            }}
            onCloseClick={() => setSelectedUser(null)}
          >
            <div className="w-[20em] ">
              <div
                className={`flex p-3 rounded-md bg-green-100 text-gray-800`}
              >
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
                  {soonToExpireDocuments.length > 0
                    ? 'Documentos por vencer:'
                    : 'Sin Documentos por vencer'}
                </span>
                {soonToExpireDocuments.map((document: any) => (
                  <div className="block text-center">
                    <span>{document.documentType.name}</span>
                  </div>
                ))}
              </div>

              <div className=" p-3 rounded-md mt-3 bg-red-100 text-gray-800">
                <span className="font-bold text-sm">
                  {expiredDocuments.length > 0
                    ? 'Documentos vencidos:'
                    : 'Sin Documentos vencidos'}
                </span>
                {expiredDocuments.map((document: any) => (
                  <div className="block text-center">
                    <span>{document.documentType.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>
    </>
  ) : (
    <Loader />
  );
}

export default React.memo(MapTrackComponent);
