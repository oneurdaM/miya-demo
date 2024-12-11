//@ts-nocheck
import cn from 'classnames'
import MapTrackComponent from './map'

export type IProps = {
  className?: string
  title: string
  latitude: number
  longitude: number
  userOnline: any
  sectores:any
  jobpositionFilter:any
}
const MapTrack = ({className,latitude,longitude,userOnline, sectores, jobpositionFilter}: IProps) => {

  return (
    <div className={cn('overflow-hidden rounded-lg bg-white p-6 md:p-7',className)}>
      <MapTrackComponent
        defaultLat={latitude}
        defaultLng={longitude}
        users={userOnline?.filter((user: any) => user.location?.latitude && user.location?.longitude)}
        sectores={sectores}
        jobpositionFilter={jobpositionFilter}
      />
    </div>
  );
};

export default MapTrack;
