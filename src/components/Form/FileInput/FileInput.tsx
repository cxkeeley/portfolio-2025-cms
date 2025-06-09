import React, { HTMLAttributes, useId, useMemo, useRef, useState } from 'react'

import { KTSVG } from '@components/KTSVG'

type DefaultProps = Pick<HTMLAttributes<HTMLInputElement>, 'onBlur'>

type FileInputProps<T> = DefaultProps & {
  uploadFn: (
    file: File,
    onUploadProgress?: (progressEvent: ProgressEvent) => void,
    controller?: AbortController
  ) => T | Promise<T>
  onUploaded: (response: T) => void
  onReset: () => void
  onError?: (error: unknown) => void
  accept?: string
}

const FileInput = <T,>({ uploadFn, onUploaded, onReset, onError, onBlur, accept }: FileInputProps<T>) => {
  const id = useId()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isUploaded, setIsUploaded] = useState<boolean>(false)
  const [filename, setFilename] = useState<string>()
  const inputRef = useRef<HTMLInputElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  const axiosController = useMemo(() => new AbortController(), [])

  const handleChooseFile = () => {
    inputRef.current?.click()
  }

  const handleProgress = (progress: ProgressEvent) => {
    if (progressRef.current) {
      progressRef.current.style.width = `${(progress.loaded / progress.total) * 100}%`
    }
  }

  const resetField = () => {
    onReset()
    clearFile()
  }

  const clearFile = () => {
    setFilename(undefined)
    setIsUploaded(false)
  }

  const handleUpload = async (file: File) => {
    try {
      setIsLoading(true)
      const response = await uploadFn(file, handleProgress, axiosController)

      onUploaded(response)

      setIsUploaded(true)
    } catch (err) {
      clearFile()
      onError?.(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0 && files[0]) {
      setFilename(files[0].name)
      handleUpload(files[0])
    }
  }

  return (
    <div
      className="d-flex align-items-center"
      style={{ zIndex: 0 }}
    >
      {/* begin::Choose file */}
      <div>
        <input
          hidden
          name={id}
          id={id}
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          onBlur={onBlur}
        />
        <button
          type="button"
          className="btn btn-sm btn-light-primary"
          onClick={handleChooseFile}
        >
          Choose file
        </button>
      </div>
      {/* end::Choose file */}

      {/* begin::Filename */}
      <div className="flex-grow-1">
        <div className="ps-3 fw-medium text-truncate">{filename || 'No file choosen'}</div>
      </div>
      {/* end::Filename */}

      {/* begin::Progress */}
      {isLoading && (
        <div className="w-20">
          <div
            className="progress"
            style={{ height: '5px' }}
          >
            <div
              ref={progressRef}
              className="progress-bar bg-primary"
              role="progressbar"
            ></div>
          </div>
        </div>
      )}
      {/* end::Progress */}

      {/* begin::Remove */}
      {isUploaded && (
        <button
          type="button"
          className="btn btn-sm btn-icon btn-active-color-primary"
          onClick={resetField}
        >
          <KTSVG
            path="/media/icons/duotune/general/gen034.svg"
            className="svg-icon-1"
          />
        </button>
      )}
      {/* end::Remove */}
    </div>
  )
}

export type { FileInputProps }

export { FileInput }
