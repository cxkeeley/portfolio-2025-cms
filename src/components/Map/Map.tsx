import L from 'leaflet'
import { FC, PropsWithChildren, useEffect, useMemo, useRef } from 'react'

import TypeUtil from '@/utils/typeUtil'

import 'leaflet/dist/leaflet.css'

const defaultLatitude = -6.25617443912924
const defaultLongitude = 106.85387450345333

type Props = {
  width: string | number
  height: string | number
  latitude?: number | string
  longitude?: number | string
  className?: string
  zoom?: number
  options?: L.MapOptions
  onReady?: (map: L.Map) => void
}

const Map: FC<PropsWithChildren<Props>> = ({
  children,
  width,
  height,
  className,
  latitude,
  longitude,
  options,
  zoom = 15,
  onReady,
}) => {
  const mapRef = useRef<L.Map>()
  const isReady = useRef<boolean>(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const parsedLatitude = useMemo<number>(() => {
    if (latitude) {
      if (TypeUtil.isString(latitude)) {
        const parsedValue = parseFloat(latitude)
        if (Number.isNaN(parsedValue)) {
          return 0
        }
        return parsedValue
      }
      return latitude
    }
    return defaultLatitude
  }, [latitude])

  const parsedLongitude = useMemo<number>(() => {
    if (longitude) {
      if (TypeUtil.isString(longitude)) {
        const parsedValue = parseFloat(longitude)
        if (Number.isNaN(parsedValue)) {
          return 0
        }
        return parsedValue
      }
      return longitude
    }
    return defaultLongitude
  }, [longitude])

  useEffect(() => {
    if (containerRef.current && !mapRef.current && !isReady.current) {
      const m = L.map(containerRef.current, options).setView([parsedLatitude, parsedLongitude], zoom)

      const contributionLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      })

      m.addLayer(contributionLayer)

      m.whenReady(() => {
        isReady.current = true
        mapRef.current = m
        onReady?.(m)
      })
    }

    return () => {
      if (isReady.current && mapRef.current) {
        mapRef.current.remove()
        mapRef.current = undefined
        isReady.current = false
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (mapRef.current) {
      // mapRef.current.setZoom(zoom) // bug occured undefined reading '_leaflet_pos'
      mapRef.current.panTo(L.latLng(parsedLatitude, parsedLongitude))
    }
  }, [zoom, parsedLatitude, parsedLongitude])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width, height }}
    >
      {children}
    </div>
  )
}

export default Map
