import { CSSProperties, ReactNode, useCallback, useId, useMemo, useRef, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { CropperModal, CropperModalProps } from '@components/CropperModal'

import { useBoolState } from '@/hooks'
import AxiosUtil from '@/utils/axiosUtil'
import FileUtil from '@/utils/fileUtil'

import { getImage } from './_helper'

type AcceptType = '.png' | '.jpg' | '.jpeg' | '.jfif'

type ImageUploadProps<T> = {
  initialImageSrc?: string
  accept?: Array<AcceptType>
  aspectRatio?: number
  cropperModalTitle?: ReactNode
  uploadFn: (
    file: File,
    onUploadProgress?: (ProgressEvent: ProgressEvent) => void,
    controller?: AbortController
  ) => Promise<T>
  onUploadSuccess?: (file: T) => void
  onUploadError?: () => void
  minResolutionWidth?: number
  minResolutionHeight?: number
  maxFileSize?: number
  cropWidth?: number
  cropHeight?: number
  cropQuality?: CropperModalProps['quality']
}

const ImageUpload = <T,>({
  uploadFn,
  onUploadSuccess,
  onUploadError,
  initialImageSrc,
  aspectRatio,
  accept = ['.png', '.jfif', '.jpeg', '.jpg'],
  cropperModalTitle,
  minResolutionWidth,
  minResolutionHeight,
  maxFileSize,
  cropWidth,
  cropHeight,
  cropQuality = 1,
}: ImageUploadProps<T>) => {
  const id = useId()
  const intl = useIntl()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [showCropperState, , showCropper, hideCropper] = useBoolState()

  const [image, setImage] = useState<File>()
  const [loadingPercent, setLoadingPercent] = useState(0)
  const [errors, setErrors] = useState<Array<string>>([])

  const acceptTypeString = useMemo(() => (accept ? accept.join(', ') : 'image/*'), [accept])

  const preview = useMemo(() => {
    if (image) {
      return URL.createObjectURL(image)
    } else {
      return initialImageSrc
    }
  }, [image, initialImageSrc])

  const previewContainerStyle: CSSProperties = {
    aspectRatio: aspectRatio ? aspectRatio : 1 / 1,
    width: 150,
    border: !preview ? '2px dashed' : '1px solid',
    cursor: 'pointer',
    alignSelf: 'self-start',
  }

  const getValidationErrors = useCallback(
    async (file: File) => {
      const validationErrors = []

      if (minResolutionWidth || minResolutionHeight) {
        const tempImage = await getImage(file)

        const isValidWidth = tempImage.width >= (minResolutionWidth || 0)
        const isValidHeight = tempImage.height >= (minResolutionHeight || 0)

        if (!isValidWidth && !isValidHeight) {
          validationErrors.push(
            intl.formatMessage(
              {
                id: 'image_upload.required_min_resolution',
              },
              { size: `${minResolutionWidth} x ${minResolutionHeight}` }
            )
          )
        } else if (!isValidWidth) {
          validationErrors.push(
            intl.formatMessage(
              {
                id: 'image_upload.required_min_resolution_width',
              },
              {
                size: minResolutionWidth,
              }
            )
          )
        } else if (!isValidHeight) {
          validationErrors.push(
            intl.formatMessage(
              {
                id: 'image_upload.required_min_resolution_height',
              },
              {
                size: minResolutionHeight,
              }
            )
          )
        }
      }

      if (maxFileSize && file.size > maxFileSize) {
        validationErrors.push(
          intl.formatMessage(
            {
              id: 'image_upload.required_max_file_size',
            },
            {
              size: FileUtil.relativeSize(maxFileSize),
            }
          )
        )
      }

      return validationErrors
    },
    [intl, maxFileSize, minResolutionHeight, minResolutionWidth]
  )

  const handleInputClick = async () => {
    inputRef.current!.value = ''
  }

  const handleCancel = () => {
    setImage(undefined)
    hideCropper()
  }

  const handleCrop: CropperModalProps['onCrop'] = async (blob) => {
    if (!image) return

    try {
      setLoadingPercent(0)

      const croppedFile = new File([blob], image.name, {
        type: blob.type,
      })

      setImage(croppedFile)

      const response = await uploadFn(croppedFile, ({ loaded, total }) => {
        setLoadingPercent((loaded / total) * 100)
      })

      onUploadSuccess?.(response)
    } catch (err) {
      if (AxiosUtil.isAxiosError(err) && err.response?.data.message) {
        setErrors([err.response.data.message])
      } else {
        setErrors([String(err)])
      }
      setImage(undefined)

      onUploadError?.()
    } finally {
      hideCropper()
    }
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files?.length) {
      const inputFile = e.currentTarget.files[0]

      const validationErrors = await getValidationErrors(inputFile)

      if (validationErrors.length > 0) {
        setErrors(validationErrors)
      } else {
        setErrors([])
        setImage(inputFile)
        showCropper()
      }
    }
  }

  return (
    <>
      <input
        type="file"
        name={id}
        value={undefined}
        hidden
        accept={acceptTypeString}
        ref={inputRef}
        onClick={handleInputClick}
        onChange={handleInputChange}
      />

      <div className="d-flex">
        <div
          className="rounded bg-gray-100 border-gray-400 d-flex align-items-center justify-content-center "
          onClick={() => inputRef.current!.click()}
          style={previewContainerStyle}
        >
          {preview ? (
            <div className="overflow-hidden h-100 w-100 overflow-hidden d-flex align-items-center justify-content-center rounded">
              <img
                src={preview}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          ) : (
            <i className="fa-solid fa-image fs-2qx" />
          )}
        </div>

        <div className=" ms-5 d-flex align-items-center flex-shrink-1">
          {image ? (
            <div className="d-flex flex-column w-100 gap-2">
              <span className="fs-4 fw-bold">{image.name}</span>

              {!errors && loadingPercent < 100 ? (
                <div className="pe-5">
                  <div className="progress">
                    <div
                      className="progress-bar bg-primary"
                      role="progressbar"
                      style={{
                        width: `${loadingPercent}%`,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <span className="fs-4 fw-semibold text-success">
                  <FormattedMessage id="image_upload.upload_success" />
                </span>
              )}
            </div>
          ) : (
            <div className="d-flex flex-column">
              <div className="form-text d-flex flex-column">
                {accept && (
                  <span>
                    <FormattedMessage
                      id="image_upload.required_file_type"
                      values={{
                        extentions: acceptTypeString,
                      }}
                    />
                  </span>
                )}

                {maxFileSize && (
                  <span>
                    <FormattedMessage
                      id="image_upload.required_max_file_size"
                      values={{
                        size: `${FileUtil.relativeSize(maxFileSize)}`,
                      }}
                    />
                  </span>
                )}

                {minResolutionWidth && minResolutionHeight && (
                  <span>
                    <FormattedMessage
                      id="image_upload.required_min_resolution"
                      values={{
                        size: `${minResolutionWidth}x${minResolutionHeight}`,
                      }}
                    />
                  </span>
                )}

                {minResolutionWidth && !minResolutionHeight && (
                  <span>
                    <FormattedMessage
                      id="image_upload.required_min_resolution_width"
                      values={{
                        size: minResolutionWidth,
                      }}
                    />
                  </span>
                )}

                {!minResolutionWidth && minResolutionHeight && (
                  <span>
                    <FormattedMessage
                      id="image_upload.required_min_resolution_height"
                      values={{
                        size: minResolutionHeight,
                      }}
                    />
                  </span>
                )}
              </div>

              {errors.length > 0 && (
                <div className="alert alert-danger d-flex flex-column p-1 mt-1">
                  {errors.map((err, i) => (
                    <span key={i}>{err}</span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <CropperModal
        isShow={showCropperState}
        onCancel={handleCancel}
        onCrop={handleCrop}
        aspectRatio={aspectRatio}
        imageSrc={preview}
        modalTitle={cropperModalTitle}
        width={cropWidth}
        height={cropHeight}
        quality={cropQuality}
        type={image?.type}
      />
    </>
  )
}

export type { ImageUploadProps }

export { ImageUpload }
