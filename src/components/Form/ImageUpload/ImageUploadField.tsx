import { useField } from 'formik'

import { ImageUpload, ImageUploadProps } from './ImageUpload'

type ImageUploadFieldProps<T> = Omit<ImageUploadProps<T>, 'errorMessage' | 'onUploaded' | 'onError'> & {
  name: string
  accessor: (data: T) => unknown
}

const ImageUploadField = <T,>({ name, accessor, ...props }: ImageUploadFieldProps<T>) => {
  const [, , helper] = useField(name)

  return (
    <ImageUpload
      {...props}
      onUploadError={() => helper.setValue(undefined)}
      onUploadSuccess={(file) => helper.setValue(accessor(file))}
    />
  )
}

export type { ImageUploadFieldProps }

export { ImageUploadField }
