import React, { useEffect, useRef } from 'react'
import { useGoogleMap } from '@react-google-maps/api'

interface CustomOverlayProps {
  bounds: google.maps.LatLngBounds
  image: string
}

const CustomOverlay: React.FC<CustomOverlayProps> = ({ bounds, image }) => {
  const map = useGoogleMap()
  const overlayRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!map) return

    class CustomOverlayView extends google.maps.OverlayView {
      private bounds_: google.maps.LatLngBounds
      private image_: string
      private div_: HTMLElement | null

      constructor(bounds: google.maps.LatLngBounds, image: string) {
        super()
        this.bounds_ = bounds
        this.image_ = image
        this.div_ = null
      }

      onAdd() {
        this.div_ = document.createElement('div')
        this.div_.style.borderStyle = 'none'
        this.div_.style.borderWidth = '0px'
        this.div_.style.position = 'absolute'

        const img = document.createElement('img')
        img.src = this.image_
        img.style.width = '100%'
        img.style.height = '100%'
        img.style.position = 'absolute'
        this.div_.appendChild(img)

        const panes = this.getPanes()
        panes?.overlayLayer.appendChild(this.div_)
      }

      draw() {
        const overlayProjection = this.getProjection()
        const sw = overlayProjection.fromLatLngToDivPixel(
          this.bounds_.getSouthWest()
        )!
        const ne = overlayProjection.fromLatLngToDivPixel(
          this.bounds_.getNorthEast()
        )!

        if (this.div_) {
          this.div_.style.left = sw.x + 'px'
          this.div_.style.top = ne.y + 'px'
          this.div_.style.width = ne.x - sw.x + 'px'
          this.div_.style.height = sw.y - ne.y + 'px'
        }
      }

      onRemove() {
        if (this.div_) {
          this.div_.parentNode?.removeChild(this.div_)
          this.div_ = null
        }
      }
    }

    new CustomOverlayView(bounds, image).setMap(map)

    return () => {
      // Cleanup logic if needed
    }
  }, [map, bounds, image])

  return <div ref={overlayRef} style={{ position: 'absolute' }} />
}

export default CustomOverlay
