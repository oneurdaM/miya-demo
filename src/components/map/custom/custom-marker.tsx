import {motion} from 'framer-motion'
import {Alert} from '@/types/alerts'
import OverlayView from '@/components/overlay/OverlayView'

interface CustomMarkerProps {
  alert: Alert
  map?: google.maps.Map
  onClick: (payload: Alert) => void
  highlight?: boolean
}

export default function CustomMarker({
  alert,
  map,
  highlight,
}: CustomMarkerProps) {

  return (
    <>
      {map && (
        <OverlayView
          position={{
            lat: alert.latitude as number,
            lng: alert.longitude as number,
          }}
          map={map}
          zIndex={highlight ? 99 : 0}
        >
          <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1,transition: {delay: Math.random() * 0.3}}}
            exit={{opacity: 0}}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 20,
            }}
          ></motion.div>
        </OverlayView>
      )}
    </>
  )
}
