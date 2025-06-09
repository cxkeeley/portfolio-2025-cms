import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { Alert } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'
import { Cropper, ReactCropperElement } from 'react-cropper'
import { FormattedMessage } from 'react-intl'

import TypeUtil from '@/utils/typeUtil'

import { Button } from '../Button'

type GetCroppedCanvasOptions = NonNullable<Parameters<ReactCropperElement['cropper']['getCroppedCanvas']>[0]> & {
  type?: string
  quality?: number
}

type CropperModalProps = {
  imageSrc?: string
  isShow: boolean
  modalTitle?: ReactNode
  aspectRatio?: number
  onCancel: () => void
  onCrop: (blob: Blob) => void
} & GetCroppedCanvasOptions

const CropperModal: FC<CropperModalProps> = ({
  isShow,
  imageSrc,
  aspectRatio,
  modalTitle,
  onCancel,
  onCrop,
  ...options
}) => {
  const cropperRef = useRef<ReactCropperElement>(null)
  const [error, setError] = useState<string>('')

  const getBlob = useCallback(
    () =>
      new Promise<Blob>((resolve, reject) => {
        const cropper = cropperRef.current?.cropper

        if (!cropper) {
          reject(new Error('Cannot crop image'))
          return
        }

        const canvas = cropper.getCroppedCanvas({
          imageSmoothingEnabled: true,
          imageSmoothingQuality: 'high',
          ...options,
        })

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Cannot crop image'))
              return
            }

            resolve(blob)
          },
          options?.type,
          options?.quality
        )
      }),
    [options]
  )

  const handleCrop = async () => {
    try {
      const blob = await getBlob()
      onCrop(blob)
    } catch (err) {
      setError(String(err))
    }
  }

  useEffect(() => {
    const cropper = cropperRef.current
    return () => {
      cropper?.cropper.destroy()
    }
  }, [])

  return (
    <Modal
      centered
      show={isShow}
      onHide={onCancel}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title as="h3">{modalTitle}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-0">
        {error && (
          <Alert
            show={TypeUtil.isDefined(error)}
            variant="danger"
            className="d-flex align-items-center p-5 mb-10"
          >
            {error}
          </Alert>
        )}
        <Cropper
          src={imageSrc}
          style={{ width: '100%', height: 480 }}
          initialAspectRatio={1 / 1}
          aspectRatio={aspectRatio}
          guides={true}
          ref={cropperRef}
          viewMode={1}
          highlight={false}
          cropBoxMovable={true}
          cropBoxResizable={true}
          background={true}
          checkCrossOrigin={true}
          checkOrientation={false}
          autoCropArea={1}
        />
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-center gap-3">
        <Button
          theme="light"
          type="button"
          onClick={onCancel}
        >
          <FormattedMessage id="form.discard" />
        </Button>

        <Button
          theme="primary"
          type="button"
          onClick={handleCrop}
        >
          <FormattedMessage id="form.save" />
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export type { CropperModalProps }

export default CropperModal
