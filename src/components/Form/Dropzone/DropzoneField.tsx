import { useField } from 'formik'
import { useEffect, useState } from 'react'

import { Dropzone, DropzoneProps } from './Dropzone'

type Props<T> = Omit<DropzoneProps<T>, 'onUploaded'> & {
  name: string
  accessor: (file: T) => string | undefined
}

const DropzoneField = <T,>({ name, accessor, ...props }: Props<T>) => {
  const [uploadedPaths, setUploadedPaths] = useState<Array<string>>([])
  const [, , helper] = useField<Array<string>>(name)

  const handleUpload = (file: T) => {
    const path = accessor(file)
    if (path) {
      setUploadedPaths((prev) => [...prev, path])
    }
  }

  const handleDelete = (file: T) => {
    const path = accessor(file)

    if (path) {
      setUploadedPaths((prev) => prev.filter((v) => v !== path))
    }
  }

  useEffect(() => {
    helper.setValue(uploadedPaths)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedPaths])

  return (
    <Dropzone
      {...props}
      multiple
      onUploaded={handleUpload}
      onDelete={handleDelete}
    />
  )
}

export { DropzoneField }
