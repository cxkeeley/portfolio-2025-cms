import { useField } from 'formik'
import { FC } from 'react'

import { NumberMaskInput, NumberMaskInputProps } from './NumberMaskInput'

type NumberMaskInputFieldProps = Omit<NumberMaskInputProps, 'onChange'> & {
  name: string
  onChange?: (value: number) => void
}

const NumberMaskInputField: FC<NumberMaskInputFieldProps> = ({ name, onChange, variant, ...props }) => {
  const [field, , helper] = useField(name)

  const handleChange = (value: number) => {
    onChange?.(value)

    helper.setValue(value)
  }

  return (
    <NumberMaskInput
      {...field}
      {...props}
      onChange={(v) => handleChange(Number(v))}
    />
  )
}

export type { NumberMaskInputFieldProps }

export { NumberMaskInputField }
