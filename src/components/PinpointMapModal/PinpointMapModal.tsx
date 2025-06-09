import L from 'leaflet'
import { FC, ReactNode, useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { FormattedMessage } from 'react-intl'

import { Button } from '@components/Button'
import Map from '@components/Map'

import 'leaflet/dist/leaflet.css'
import MapPinpoint from '@components/MapPinpoint'

type Props = {
  isShow: boolean
  modalTitle: ReactNode
  latitude?: number
  longitude?: number
  onSelected: (latitude: number, longitude: number) => void
  onClose: () => void
}

const PinpointMapModal: FC<Props> = ({ isShow, modalTitle, latitude, longitude, onSelected, onClose }) => {
  const [map, setMap] = useState<L.Map>()
  const [isMoving, setIsMoving] = useState<boolean>(false)

  const handleMapLoad = (mapInstance: L.Map) => {
    setMap(mapInstance)
  }

  const handleSelectLocation = () => {
    if (map) {
      const { lat, lng } = map.getCenter()
      onSelected(lat, lng)
    }
  }

  useEffect(() => {
    const handleMoveStart = () => {
      setIsMoving(true)
    }

    const handleMoveEnd = () => {
      setIsMoving(false)
    }

    map?.addEventListener('movestart', handleMoveStart)
    map?.addEventListener('moveend', handleMoveEnd)

    return () => {
      map?.removeEventListener('movestart', handleMoveStart)
      map?.removeEventListener('moveend', handleMoveEnd)
    }
  }, [map])

  return (
    <Modal
      centered
      size="lg"
      show={isShow}
      onHide={onClose}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h3">{modalTitle}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Map
          width="100%"
          height="40vh"
          className="rounded border"
          latitude={latitude}
          longitude={longitude}
          onReady={handleMapLoad}
        >
          <MapPinpoint elevated={isMoving} />
        </Map>
      </Modal.Body>

      <Modal.Footer className="justify-content-center">
        <Button
          theme="primary"
          disabled={isMoving}
          onClick={handleSelectLocation}
        >
          <FormattedMessage id="pinpoint_map.button.select_location" />
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default PinpointMapModal
