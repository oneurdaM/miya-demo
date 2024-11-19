//@ts-nocheck
import cn from 'classnames'
import MapTrackComponent from './map-user-id'
import MapArray from './map-user-id'

export type IProps = {
  className?: string
  title: string
  latitude?: number
  longitude?: number
  userId?: any
}
const MapTrackUserId = ({
  className,
  latitude,
  longitude,
  userOnline,
  userId,
  coordenadas,
}: IProps) => {
  return (
    <>
      <div
        className={cn(
          'overflow-hidden rounded-lg bg-white p-6 md:p-7',
          className
        )}
      >
        <MapTrackComponent
          latitud={latitude}
          longitud={longitude}
          userId={userId}
        />
      </div>
    </>
  )
}

export default MapTrackUserId
