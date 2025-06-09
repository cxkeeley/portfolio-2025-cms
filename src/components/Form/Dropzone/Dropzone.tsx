import { useEffect, useState } from 'react'
import { DropzoneOptions, useDropzone } from 'react-dropzone'
import { useIntl } from 'react-intl'

import { useToast } from '@/hooks'
import StringUtil from '@/utils/stringUtil'

import { DropzoneHelperText } from './DropzoneHelperText'
import { DropzoneItem } from './DropzoneItem'

export type DropzoneProps<T> = {
  multiple?: boolean
  options?: DropzoneOptions
  enableDelete?: boolean
  enablePreview?: boolean
  minHeight?: number
  uploadFn: (file: File, setLoadingPercent: (num: number) => void, axiosController: AbortController) => Promise<T>
  onUploaded?: (file: T) => void
  onDelete?: (file: T) => void
  statusUploading?: (status: boolean) => void
}

export type CustomFile<T> = {
  file: File
  unique_id: string
  uploadedFile?: T
  fileUrl?: string
  blob?: Blob
}

const Dropzone = <T,>({
  multiple,
  uploadFn,
  enableDelete,
  enablePreview,
  minHeight,
  onDelete,
  onUploaded,
  options,
  statusUploading,
}: DropzoneProps<T>) => {
  const intl = useIntl()
  const toast = useToast()
  const [files, setFiles] = useState<Array<CustomFile<T>>>([])

  const { getRootProps, getInputProps } = useDropzone({
    ...options,
    onDropAccepted: (acceptedFiles) => {
      const addedFiles = acceptedFiles.map<CustomFile<T>>((file) => ({
        file: file,
        unique_id: StringUtil.generateUUID4(),
        fileUrl: URL.createObjectURL(file),
        blob: new Blob([file], { type: file.type }),
      }))
      setFiles((prev) => [...prev, ...addedFiles])
    },
    onDropRejected: (rejectedFiles) => {
      rejectedFiles.forEach((file) => {
        toast.error(`${file.file.name} \n${file.errors.map((err) => ` ${err.message}\n`)}`)
        return null
      })
    },
  })

  const removeFile = async (index: number) => {
    let deleted: Array<CustomFile<T>> = []
    await setFiles((prev) => {
      const copy = [...prev]
      deleted = copy.splice(index, 1)
      return copy
    })
    if (deleted[0].uploadedFile) {
      if (onDelete) {
        onDelete(deleted[0].uploadedFile)
      }
    }
  }

  const handleUpload = (res: T, index: number) => {
    setFiles((prev) => {
      const copy = [...prev]
      copy[index].uploadedFile = res
      return copy
    })
    if (onUploaded) {
      onUploaded(res)
    }
  }

  useEffect(() => {
    const allFiles = files.length
    const uplaodedFiles = files.filter((file) => !!file.uploadedFile).length
    if (statusUploading) {
      statusUploading(allFiles !== uplaodedFiles)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files])

  return (
    <div className="d-flex flex-column">
      <div {...getRootProps({ className: 'dropzone dropzone-queue mb-2' })}>
        <div
          className="d-flex flex-column justify-content-center dropzone-panel"
          style={{ minHeight }}
        >
          <div className="d-flex flex-column align-items-center justify-content-center w-100 min-h-100px">
            <i className="fs-1 fa fa-cloud-arrow-up mb-1"></i>
            <span className="fs-5 fw-bold">{intl.formatMessage({ id: 'drag_and_drop_file' })}</span>
          </div>

          <input
            {...getInputProps({
              multiple,
              type: 'file',
              style: { display: 'none' },
            })}
          />

          <div className="dropzone-items wm-200px">
            {files.map((file, i) => {
              return (
                <DropzoneItem
                  key={`dropzone-item-${i}`}
                  file={file}
                  enableDelete={enableDelete}
                  enablePreview={enablePreview}
                  uploadFn={uploadFn}
                  onUploaded={(res) => handleUpload(res, i)}
                  onDelete={() => removeFile(i)}
                />
              )
            })}
          </div>
        </div>
      </div>

      <DropzoneHelperText
        accept={options?.accept}
        maxSize={options?.maxSize}
      />
    </div>
  )
}

export { Dropzone }
