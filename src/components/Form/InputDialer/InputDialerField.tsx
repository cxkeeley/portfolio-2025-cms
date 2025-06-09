import { useField } from 'formik'
import { FC } from 'react'

import { InputDialer, InputDialerProps } from './InputDialer'

type Props = Omit<InputDialerProps, 'value' | 'onChange'> & {
  name: string
  onChange?: (value: number) => void
}

const InputDialerField: FC<Props> = ({ name, onChange, ...props }) => {
  const [field, , helper] = useField(name)

  const handleChange = (value: number) => {
    onChange?.(value)
    helper.setValue(value)
  }

  return (
    <InputDialer
      {...field}
      {...props}
      onChange={handleChange}
    />
  )
}

export { InputDialerField }
