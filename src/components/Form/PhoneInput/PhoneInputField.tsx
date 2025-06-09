import { useField } from 'formik'
import { FC } from 'react'

import { PhoneInput, PhoneInputProps } from './PhoneInput'

type PhoneInputFieldProps = Omit<PhoneInputProps, 'onChange'> & {
  name: string
}

const PhoneInputField: FC<PhoneInputFieldProps> = ({ name, isClearable = true, ...props }) => {
  const [field, , helper] = useField(name)

  return (
    <PhoneInput
      {...props}
      value={field.value}
      onChange={helper.setValue}
      isClearable={isClearable}
    />
  )
}

export type { PhoneInputFieldProps }

export { PhoneInputField }
