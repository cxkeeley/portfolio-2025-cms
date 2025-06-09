import { useField } from 'formik'

import AxiosUtil from '@/utils/axiosUtil'

import { FileInput, FileInputProps } from './FileInput'

type FileInputFieldProps<T> = Omit<FileInputProps<T>, 'onError' | 'onUploaded' | 'onReset'> & {
  name: string
  accessor: (response: T) => unknown
}

const FileInputField = <T,>({ name, accessor, ...props }: FileInputFieldProps<T>) => {
  const [field, , helper] = useField(name)

  const handleReset = () => {
    helper.setValue(null)
    helper.setError(undefined)
  }

  const handleUploaded = (response: T) => {
    helper.setValue(accessor(response))
  }

  const handleError = (err: unknown) => {
    if (AxiosUtil.isAxiosError(err)) {
      helper.setError(err.response?.data.message)
    } else {
      helper.setError(String(err))
    }
  }

  return (
    <FileInput
      {...props}
      {...field}
      onReset={handleReset}
      onUploaded={handleUploaded}
      onError={handleError}
      uploadFn={(...args) => {
        helper.setTouched(true)
        handleReset()
        return props.uploadFn(...args)
      }}
    />
  )
}

export { FileInputField }
