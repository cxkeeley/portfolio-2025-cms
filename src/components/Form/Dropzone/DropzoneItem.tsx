import { useEffect, useMemo, useState } from 'react'

import { KTSVG } from '@components/KTSVG'

import PromiseUtil from '@/utils/PromiseUtil'
import AxiosUtil from '@/utils/axiosUtil'
import FileUtil from '@/utils/fileUtil'

import { CustomFile } from './Dropzone'

type Props<T> = {
  file: CustomFile<T>
  enableDelete?: boolean
  enablePreview?: boolean
  uploadFn: (file: File, setLoadingPercent: (num: number) => void, axiosController: AbortController) => Promise<T>
  onUploaded: (res: T) => void
  onDelete: () => void
}

export const DropzoneItem = <T,>({ file, enableDelete, enablePreview, uploadFn, onUploaded, onDelete }: Props<T>) => {
  const [loadingPercent, setLoadingPercent] = useState<number>(0)
  const [error, setError] = useState<string | null | undefined>(null)
  const axiosController = useMemo(() => new AbortController(), [])

  const tryUpload = async (timeout?: boolean) => {
    setError(null)
    setLoadingPercent(0)
    timeout && (await PromiseUtil.delay(500))
    try {
      const upload = await uploadFn(file.file, setLoadingPercent, axiosController)
      onUploaded(upload)
    } catch (err) {
      if (AxiosUtil.isAxiosError(err)) {
        setError(err?.response?.data?.message || err.message)
      } else {
        setError(String(err))
      }
    }
  }

  useEffect(() => {
    if (!file.uploadedFile) {
      tryUpload()
    }

    return () => {
      axiosController.abort()
    }
    // eslint-disable-next-line
  }, [])

  const memorize = useMemo(
    () => (
      <div
        className="dropzone-item"
        onClick={() => {
          enablePreview && window.open(file.fileUrl, '_blank')
        }}
      >
        {/* begin::File */}
        <div className="dropzone-file d-flex flex-column justify-content-center align-items-start">
          <div
            className="dropzone-filename mt-1"
            title={file.file.name}
          >
            {error && <i className="fas fa-exclamation-circle me-3 text-danger"></i>}
            <span className="me-3">{file.file.name}</span>{' '}
            <strong>
              <span>({FileUtil.relativeSize(file.file.size)})</span>
            </strong>
          </div>

          {/* begin::Error */}
          {error && <div className="dropzone-error"> {error} </div>}
          {/* end::Error */}
        </div>
        {/* end::File */}

        {/* begin::Progress */}
        {!error && loadingPercent !== 100 ? (
          <div className="dropzone-progress">
            <div className="progress">
              <div
                className="progress-bar bg-primary"
                role="progressbar"
                style={{
                  width: `${loadingPercent}%`,
                }}
              ></div>
            </div>
          </div>
        ) : !error ? (
          <div>
            <KTSVG
              path="/media/icons/duotune/arrows/arr085.svg"
              className="svg-icon svg-icon-1 svg-icon-success"
            />
          </div>
        ) : (
          <button
            type="button"
            className="dropzone-delete me-1 border-0 rounded"
            onClick={(e) => {
              e.stopPropagation()
              tryUpload(true)
            }}
          >
            <i className="fas fa-history"></i>
          </button>
        )}
        {/* end::Progress */}

        {/* begin::Toolbar */}
        {(enableDelete || loadingPercent !== 100) && (
          <div className="dropzone-toolbar">
            <button
              type="button"
              className="dropzone-delete border-0 rounded"
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        {/* end::Toolbar */}
      </div>
    ),
    // eslint-disable-next-line
    [file, loadingPercent, error]
  )

  return <>{memorize}</>
}
