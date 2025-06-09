import { useField } from 'formik'
import { FC } from 'react'

import { OTPInput, OTPInputProps } from './OTPInput'

type Props = Omit<OTPInputProps, 'onChange'> & {
  name: string
}

const OTPInputField: FC<Props> = ({ name, variant = 'solid', ...props }) => {
  const [field, , helper] = useField(name)

  const handleChange = (value: string) => {
    helper.setValue(value)
  }

  return (
    <OTPInput
      {...field}
      {...props}
      variant={variant}
      onChange={handleChange}
    />
  )
}

export { OTPInputField }
