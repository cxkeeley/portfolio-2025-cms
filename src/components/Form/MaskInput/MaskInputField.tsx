import { useField } from 'formik'
import { FC, useEffect, useRef } from 'react'

import { MaskInput, MaskInputProps, RefMaskInputField } from './MaskInput'

type MaskInputFieldProps = MaskInputProps & {
  name: string
}

const MaskInputField: FC<MaskInputFieldProps> = ({ name, onChange, ...props }) => {
  const ref = useRef<RefMaskInputField>(null)
  const [field, , helper] = useField(name)

  useEffect(() => {
    if (!field.value && ref.current) {
      ref.current.clearValue()
    }
  }, [field.value])

  const handleChange = (value: string) => {
    if (onChange) {
      onChange(value)
    }
    helper.setValue(value)
  }

  return (
    <MaskInput
      ref={ref}
      {...field}
      {...props}
      onChange={handleChange}
    />
  )
}

export type { MaskInputFieldProps }

export { MaskInputField }
